package com.cafeteria.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DbHealthController {
  @GetMapping("/api/health")
  public String health() { return "OK"; }
}
