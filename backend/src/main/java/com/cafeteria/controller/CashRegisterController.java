package com.cafeteria.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cafeteria.model.Movement;
import com.cafeteria.repository.MovementRepository;

@RestController
@RequestMapping("/api/cash")
@CrossOrigin(origins = "*") // permite peticiones desde tu front
public class CashRegisterController {

    private final MovementRepository repository;

    public CashRegisterController(MovementRepository repository) {
        this.repository = repository;
    }

    // Obtener todos los movimientos
    @GetMapping("/movements")
    public List<Movement> getAll() {
        return repository.findAll();
    }

    // Crear un nuevo movimiento
    @PostMapping("/movements")
    public Movement create(@RequestBody Movement movement) {
        return repository.save(movement);
    }
}
