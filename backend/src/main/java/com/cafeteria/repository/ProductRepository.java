package com.cafeteria.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cafeteria.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

  @EntityGraph(attributePaths = "category")
  Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);

  @EntityGraph(attributePaths = "category")
  Page<Product> findByNameContainingIgnoreCase(String q, Pageable pageable);

  @EntityGraph(attributePaths = "category")
  Page<Product> findByCategory_IdAndNameContainingIgnoreCase(Long categoryId, String q, Pageable pageable);

  // “select all” con categoría cargada, sin override
  @EntityGraph(attributePaths = "category")
  Page<Product> findAllBy(Pageable pageable);
}
