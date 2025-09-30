package com.example.app.service.impl;

import com.example.app.dto.ProductDto;
import com.example.app.mapper.ProductMapper;
import com.example.app.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

  private final ProductMapper productMapper;

  @Override
  public List<ProductDto> getProductList() {
    List<ProductDto> productList = productMapper.getProductList();
    return productList;
  }
}
