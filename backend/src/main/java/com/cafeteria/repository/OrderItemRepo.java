package com.cafeteria.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cafeteria.model.OrderItem;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {}
