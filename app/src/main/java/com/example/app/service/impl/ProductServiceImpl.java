package com.example.app.service.impl;

import com.example.app.dto.ProductDto;
import com.example.app.exception.ApiInvalidUpdateException;
import com.example.app.mapper.ProductMapper;
import com.example.app.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

  public ProductDto createProduct(String name, String description, int price, int stock) throws Exception {
    if (!productMapper.createProduct(name, description, price, stock)) {
      throw new ApiInvalidUpdateException("登録に失敗しました。");
    }
    return new ProductDto();
  }
}
