package com.cafeteria.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_item")
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "order_id")
  private OrderEntity order;

  @Column(name = "product_id", nullable = false)
  private Long productId;

  @Column(name = "qty", nullable = false)
  private Integer qty;

  // En DB tienes unit_price (no 'price')
  @Column(name = "unit_price", nullable = false)
  private BigDecimal price;

  @Column(name = "amount", nullable = false)
  private BigDecimal amount;

  public OrderItem() {} // <- público

  public Long getId() { return id; }
  public OrderEntity getOrder() { return order; }
  public void setOrder(OrderEntity o) { this.order = o; }
  public Long getProductId() { return productId; }
  public void setProductId(Long p) { this.productId = p; }
  public Integer getQty() { return qty; }
  public void setQty(Integer q) { this.qty = q; }
  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal p) { this.price = p; }
  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal a) { this.amount = a; }
}
