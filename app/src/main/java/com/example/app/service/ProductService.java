package com.example.app.service;

import com.example.app.dto.ProductDto;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProductService {
  List<ProductDto> getProductList();
  ProductDto createProduct(String name, String description, int price, int stock) throws Exception;
}
