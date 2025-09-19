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

@Entity @Table(name = "cash_movement")
public class CashMovement {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

  @ManyToOne(optional=false) @JoinColumn(name="session_id")
  private CashSession session;

  @Column(name="type",   nullable=false) private String type;   // sale|expense|deposit|withdrawal|adjustment
  @Column(name="method")                  private String method; // cash|card|null
  @Column(name="amount", nullable=false)  private BigDecimal amount;
  @Column(name="note")                    private String note;
  @Column(name="created_at", nullable=false) private OffsetDateTime createdAt;

  // getters & setters
  public Long getId(){return id;}
  public CashSession getSession(){return session;}
  public void setSession(CashSession s){this.session=s;}
  public String getType(){return type;}
  public void setType(String t){this.type=t;}
  public String getMethod(){return method;}
  public void setMethod(String m){this.method=m;}
  public BigDecimal getAmount(){return amount;}
  public void setAmount(BigDecimal a){this.amount=a;}
  public String getNote(){return note;}
  public void setNote(String n){this.note=n;}
  public OffsetDateTime getCreatedAt(){return createdAt;}
  public void setCreatedAt(OffsetDateTime d){this.createdAt=d;}
}
