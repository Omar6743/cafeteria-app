package com.cafeteria.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name = "cash_session")
public class CashSession {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name="opening_float", nullable=false) private BigDecimal openingFloat;
  @Column(name="opened_at", nullable=false)    private OffsetDateTime openedAt;
  @Column(name="closed_at")                    private OffsetDateTime closedAt;
  @Column(name="status", nullable=false)       private String status; // OPEN|CLOSED

  // getters & setters
  public Long getId(){return id;}
  public BigDecimal getOpeningFloat(){return openingFloat;}
  public void setOpeningFloat(BigDecimal v){this.openingFloat=v;}
  public OffsetDateTime getOpenedAt(){return openedAt;}
  public void setOpenedAt(OffsetDateTime v){this.openedAt=v;}
  public OffsetDateTime getClosedAt(){return closedAt;}
  public void setClosedAt(OffsetDateTime v){this.closedAt=v;}
  public String getStatus(){return status;}
  public void setStatus(String v){this.status=v;}
}
