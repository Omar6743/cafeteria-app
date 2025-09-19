package com.cafeteria.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="`order`") // palabra reservada
public class OrderEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "session_id")
  private CashSession session;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "note")
  private String note;

  @Column(name = "pay_method")
  private String payMethod; // cash|card

  @Column(name = "subtotal", nullable = false)
  private BigDecimal subtotal;

  @Column(name = "discount", nullable = false)
  private BigDecimal discount;

  @Column(name = "total", nullable = false)
  private BigDecimal total;

  public OrderEntity() {} // <- público para new OrderEntity()

  public Long getId() { return id; }
  public CashSession getSession() { return session; }
  public void setSession(CashSession s) { this.session = s; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime t) { this.createdAt = t; }
  public String getNote() { return note; }
  public void setNote(String n) { this.note = n; }
  public String getPayMethod() { return payMethod; }
  public void setPayMethod(String p) { this.payMethod = p; }
  public BigDecimal getSubtotal() { return subtotal; }
  public void setSubtotal(BigDecimal v) { this.subtotal = v; }
  public BigDecimal getDiscount() { return discount; }
  public void setDiscount(BigDecimal v) { this.discount = v; }
  public BigDecimal getTotal() { return total; }
  public void setTotal(BigDecimal v) { this.total = v; }
}
