package com.example.app.service;

import com.example.app.dto.ProductDetailDto;
import com.example.app.dto.ProductDto;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

  List<ProductDto> getProductList();

  ProductDetailDto detailProduct(int productId) throws Exception;

  void createProduct(ProductDto productDto, MultipartFile imageFile) throws Exception;

}
