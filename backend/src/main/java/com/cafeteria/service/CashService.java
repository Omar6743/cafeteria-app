package com.cafeteria.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cafeteria.common.dto.CashDayDTO;
import com.cafeteria.common.dto.SaleReq;
import com.cafeteria.common.dto.SaleResultDTO;
import com.cafeteria.model.CashMovement;
import com.cafeteria.model.CashSession;
import com.cafeteria.model.OrderEntity;
import com.cafeteria.model.OrderItem;
import com.cafeteria.repository.CashMovementRepo;
import com.cafeteria.repository.CashSessionRepo;
import com.cafeteria.repository.OrderItemRepo;
import com.cafeteria.repository.OrderRepo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class CashService {

  private final CashSessionRepo sessionRepo;
  private final OrderRepo orderRepo;
  private final OrderItemRepo itemRepo;
  private final CashMovementRepo movRepo;

  @PersistenceContext
  private EntityManager em;

  public CashService(CashSessionRepo s, OrderRepo o, OrderItemRepo i, CashMovementRepo m) {
    this.sessionRepo = s;
    this.orderRepo = o;
    this.itemRepo = i;
    this.movRepo = m;
  }

  /* ======================
   *  Apertura / Cierre
   * ====================== */

  /** Abre una sesión de caja con el fondo inicial. */
  @Transactional
  public CashSession open(double openingFloat) {
    CashSession cs = new CashSession();
    try {
      var m = CashSession.class.getMethod("setOpeningFloat", BigDecimal.class);
      m.invoke(cs, BigDecimal.valueOf(openingFloat));
    } catch (ReflectiveOperationException ignore) {
      try {
        var m = CashSession.class.getMethod("setOpeningFloat", double.class);
        m.invoke(cs, openingFloat);
      } catch (ReflectiveOperationException ignored) {}
    }
    cs.setOpenedAt(OffsetDateTime.now());
    cs.setStatus("OPEN");
    return sessionRepo.save(cs);
  }

  /** Cierra una sesión de caja por id y la devuelve actualizada. */
  @Transactional
  public CashSession close(Long sessionId) {
    CashSession cs = sessionRepo.findById(sessionId)
        .orElseThrow(() -> new IllegalArgumentException("Sesión no encontrada"));
    cs.setStatus("CLOSED");
    cs.setClosedAt(OffsetDateTime.now());
    return sessionRepo.save(cs);
  }

  /* ======================
   *  Resumen del día
   * ====================== */
  @Transactional(readOnly = true)
  public CashDayDTO getDay(LocalDate date) {
    Date sqlDate = Date.valueOf(date);

    BigDecimal openFloat = nvl(sumSql(
        "select coalesce(sum(opening_float),0) from cash_session where date(opened_at)=?", sqlDate));

    BigDecimal cashSales = nvl(sumSql(
        "select coalesce(sum(amount),0) from cash_movement where date(created_at)=? and type='sale' and method='cash'", sqlDate));

    BigDecimal cardSales = nvl(sumSql(
        "select coalesce(sum(amount),0) from cash_movement where date(created_at)=? and type='sale' and method='card'", sqlDate));

    BigDecimal expenses = nvl(sumSql(
        "select coalesce(sum(amount),0) from cash_movement where date(created_at)=? and type='expense'", sqlDate));

    BigDecimal deposits = nvl(sumSql(
        "select coalesce(sum(amount),0) from cash_movement where date(created_at)=? and type='deposit'", sqlDate));

    BigDecimal withdrawals = nvl(sumSql(
        "select coalesce(sum(amount),0) from cash_movement where date(created_at)=? and type='withdrawal'", sqlDate));

    BigDecimal adjustments = nvl(sumSql(
        "select coalesce(sum(amount),0) from cash_movement where date(created_at)=? and type='adjustment'", sqlDate));

    // esperado (si lo ocupas)
    BigDecimal expectedCash = openFloat
        .add(cashSales)
        .subtract(expenses)
        .subtract(deposits)
        .subtract(withdrawals)
        .add(adjustments);

    List<CashDayDTO.MovementRow> rows = List.of();

    return new CashDayDTO(
        date,
        cashSales.doubleValue(),
        cardSales.doubleValue(),
        expenses.doubleValue(),
        deposits.doubleValue(),
        withdrawals.doubleValue(),
        adjustments.doubleValue(),
        rows
    );
  }

  /* ======================
   *  Venta (POS)
   * ====================== */
  @Transactional
  public SaleResultDTO registerSale(SaleReq req) {
    CashSession session = sessionRepo.findById(req.getSessionId())
        .orElseThrow(() -> new IllegalArgumentException("Sesión no encontrada"));
    if (!"OPEN".equalsIgnoreCase(session.getStatus()))
      throw new IllegalStateException("La sesión no está abierta");

    BigDecimal subtotal = BigDecimal.ZERO;
    List<OrderItem> list = new ArrayList<>();
    for (SaleReq.Item it : req.getItems()) {
      if (it.getQty() == null || it.getQty() <= 0) continue;
      double priceD = it.getPrice() != null ? it.getPrice() : 0.0;
      BigDecimal price  = BigDecimal.valueOf(priceD);
      BigDecimal amount = price.multiply(BigDecimal.valueOf(it.getQty()));

      OrderItem oi = new OrderItem();
      oi.setProductId(it.getProductId());
      oi.setQty(it.getQty());
      oi.setPrice(price);
      oi.setAmount(amount);
      list.add(oi);

      subtotal = subtotal.add(amount);
    }

    double d  = req.getDiscount() != null ? req.getDiscount() : 0.0;
    BigDecimal discount = BigDecimal.valueOf(d);
    BigDecimal total = subtotal.subtract(discount);
    if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;

    OrderEntity order = new OrderEntity();
    order.setSession(session);
    order.setCreatedAt(OffsetDateTime.now());
    order.setNote(req.getNote());
    order.setPayMethod(req.getPayMethod());
    order.setSubtotal(subtotal);
    order.setDiscount(discount);
    order.setTotal(total);
    order = orderRepo.save(order);

    for (OrderItem oi : list) oi.setOrder(order);
    itemRepo.saveAll(list);

    CashMovement sale = new CashMovement();
    sale.setSession(session);
    sale.setType("sale");
    sale.setMethod(req.getPayMethod());
    sale.setAmount(total);
    sale.setNote(req.getNote());
    sale.setCreatedAt(OffsetDateTime.now());
    movRepo.save(sale);

    // Solo calcular cambio para ticket (no guardar movimiento)
    BigDecimal change = BigDecimal.ZERO;
    if ("cash".equalsIgnoreCase(req.getPayMethod())) {
      double cg = req.getCashGiven() != null ? req.getCashGiven() : 0.0;
      BigDecimal given = BigDecimal.valueOf(cg);
      BigDecimal diff = given.subtract(total);
      if (diff.compareTo(BigDecimal.ZERO) > 0) change = diff;
    }

    return new SaleResultDTO(order.getId(), total.doubleValue(), change.doubleValue());
  }

  /* ===== Helpers privados ===== */
  private BigDecimal nvl(Object o) {
    if (o == null) return BigDecimal.ZERO;
    if (o instanceof BigDecimal bd) return bd;
    if (o instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
    return BigDecimal.ZERO;
  }

  private Object sumSql(String sql, Object param) {
    return em.createNativeQuery(sql).setParameter(1, param).getSingleResult();
  }
}
