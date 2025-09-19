package com.cafeteria.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cafeteria.repository.CategoryRepository;
import com.cafeteria.service.ProductService;

@RestController
@RequestMapping("/api")
public class ProductController {

  private final CategoryRepository categoryRepo;
  private final ProductService productService;

  public ProductController(CategoryRepository categoryRepo, ProductService productService) {
    this.categoryRepo = categoryRepo;
    this.productService = productService;
  }

  public record CategoryDTO(Long id, String slug, String name) {}
  public record ProductDTO(Long id, String name, BigDecimal basePrice,
                           Long categoryId, String categoryName, boolean active) {}

  @GetMapping("/categories")
  public List<CategoryDTO> categories() {
    return categoryRepo.findAll().stream()
      .map(c -> new CategoryDTO(c.getId(), c.getSlug(), c.getName()))
      .toList();
  }

  @GetMapping("/products")
  public Page<ProductDTO> products(
      @RequestParam(required=false) Long cat,
      @RequestParam(required=false) String q,
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="24") int size
  ) {
    return productService.search(cat, q, page, size)
      .map(p -> new ProductDTO(
        p.getId(), p.getName(), p.getBasePrice(),
        p.getCategory().getId(), p.getCategory().getName(), p.isActive()
      ));
  }
}
