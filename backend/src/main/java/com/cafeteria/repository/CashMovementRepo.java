package com.cafeteria.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cafeteria.model.CashMovement;

public interface CashMovementRepo extends JpaRepository<CashMovement, Long> {}
