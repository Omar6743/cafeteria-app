package com.cafeteria.common.dto;
import java.time.LocalDate;
import java.util.List;

public record CashDayDTO(
  LocalDate date,
  double cashSales, double cardSales,
  double expenses, double deposits, double withdrawals, double adjustments,
  List<MovementRow> movements
){
  public record MovementRow(String type, String method, double amount, String note, String createdAt){}
}
