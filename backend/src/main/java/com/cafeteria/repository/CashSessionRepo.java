package com.cafeteria.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cafeteria.model.CashSession;

public interface CashSessionRepo extends JpaRepository<CashSession, Long> {}
