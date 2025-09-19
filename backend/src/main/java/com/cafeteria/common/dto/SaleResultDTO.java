package com.cafeteria.common.dto;

public class SaleResultDTO {
  private Long orderId;
  private Double total;
  private Double change;

  public SaleResultDTO() {}
  public SaleResultDTO(Long orderId, Double total, Double change) {
    this.orderId = orderId; this.total = total; this.change = change;
  }
  public Long getOrderId() { return orderId; }
  public void setOrderId(Long orderId) { this.orderId = orderId; }
  public Double getTotal() { return total; }
  public void setTotal(Double total) { this.total = total; }
  public Double getChange() { return change; }
  public void setChange(Double change) { this.change = change; }
}
