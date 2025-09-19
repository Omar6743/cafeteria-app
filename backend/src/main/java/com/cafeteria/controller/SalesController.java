package com.cafeteria.controller;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cafeteria.common.dto.SaleReq;
import com.cafeteria.common.dto.SaleResultDTO;
import com.cafeteria.service.CashService;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"})
public class SalesController {

  private final CashService cash;

  public SalesController(CashService cash) {
    this.cash = cash;
  }

  @PostMapping
  @Transactional
  public SaleResultDTO create(@RequestBody SaleReq req){
    return cash.registerSale(req);
  }
}
