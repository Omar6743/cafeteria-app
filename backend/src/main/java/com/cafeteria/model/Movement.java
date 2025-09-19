package com.cafeteria.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Movement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;   // ingreso / egreso
    private String method; // efectivo / tarjeta
    private Double amount;
    private String note;

    private LocalDateTime createdAt = LocalDateTime.now();

    // getters y setters
}
