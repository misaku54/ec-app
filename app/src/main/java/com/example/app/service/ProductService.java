package com.example.app.service;

import com.example.app.dto.ImageUpdateDto;
import com.example.app.dto.ProductDeleteDto;
import com.example.app.dto.ProductDetailDto;
import com.example.app.dto.ProductDto;
import com.example.app.form.ProductSearchParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

  List<ProductDto> getProductList();

  List<ProductDetailDto> searchProducts(ProductSearchParam param);

  ProductDetailDto getProductDetail(int productId) throws Exception;

  ProductDetailDto createProduct(ProductDto productDto, List<MultipartFile> imageFiles) throws Exception;

  void updateProduct(ProductDto productDto, List<ImageUpdateDto> existingImages) throws Exception;

  ProductDeleteDto deleteProduct(int productId) throws Exception;

}
