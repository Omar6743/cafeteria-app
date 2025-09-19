package com.cafeteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cafeteria.model.Movement;

public interface MovementRepository extends JpaRepository<Movement, Long> {
}
