package com.cafeteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cafeteria.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // si luego quieres búsquedas personalizadas, aquí se agregan
}
