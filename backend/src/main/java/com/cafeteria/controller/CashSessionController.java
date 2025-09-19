package com.cafeteria.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cafeteria.common.dto.CashDayDTO;
import com.cafeteria.common.dto.OpenSessionReq;
import com.cafeteria.model.CashSession;
import com.cafeteria.service.CashService;

@RestController
@RequestMapping("/api/cash-sessions")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}) 
public class CashSessionController {

  private final CashService cash;

  // Constructor explícito (sin Lombok)
  public CashSessionController(CashService cash) {
    this.cash = cash;
  }

  @PostMapping("/open")
  public CashSession open(@RequestBody OpenSessionReq req){
    return cash.open(req.openingFloat());
  }

  @PostMapping("/{id}/close")
  public CashSession close(@PathVariable Long id){
    return cash.close(id);
  }

  @GetMapping("/by-date")
  public CashDayDTO byDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
    return cash.getDay(date);
  }
}
