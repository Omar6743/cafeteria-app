package com.cafeteria.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.cafeteria.model.Product;
import com.cafeteria.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // (opcional) @Transactional(readOnly = true)
    public Page<Product> search(Long cat, String q, int page, int size) {
        // Si quieres orden: Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Pageable pageable = PageRequest.of(page, size);
        boolean hasCat = (cat != null);
        boolean hasQ = (q != null && !q.isBlank());

        if (hasCat && hasQ) {
            return productRepository.findByCategory_IdAndNameContainingIgnoreCase(cat, q, pageable);
        } else if (hasCat) {
            return productRepository.findByCategory_Id(cat, pageable);
        } else if (hasQ) {
            return productRepository.findByNameContainingIgnoreCase(q, pageable);
        } else {
            // 👇 Importante: usar el método con EntityGraph
            return productRepository.findAllBy(pageable);
        }
    }
}
