package com.example.app.service;

import com.example.app.dto.ProductDto;

import java.util.List;

public interface ProductService {
  List<ProductDto> getProductList();
}
