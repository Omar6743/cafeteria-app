package com.cafeteria.common.dto;

import java.util.List;

public class SaleReq {
  private Long sessionId;
  private List<Item> items;
  private Double discount;
  private String note;
  private String payMethod; // "cash" | "card"
  private Double cashGiven; // null si tarjeta

  public static class Item {
    private Long productId;
    private Integer qty;
    private Double price;

    public Item() {}
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
  }

  public SaleReq() {}
  public Long getSessionId() { return sessionId; }
  public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
  public List<Item> getItems() { return items; }
  public void setItems(List<Item> items) { this.items = items; }
  public Double getDiscount() { return discount; }
  public void setDiscount(Double discount) { this.discount = discount; }
  public String getNote() { return note; }
  public void setNote(String note) { this.note = note; }
  public String getPayMethod() { return payMethod; }
  public void setPayMethod(String payMethod) { this.payMethod = payMethod; }
  public Double getCashGiven() { return cashGiven; }
  public void setCashGiven(Double cashGiven) { this.cashGiven = cashGiven; }
}
