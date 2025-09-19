package com.cafeteria.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cafeteria.model.OrderEntity;

public interface OrderRepo extends JpaRepository<OrderEntity, Long> {}
