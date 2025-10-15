package com.example.app.service.impl;

import com.example.app.dto.ProductDto;
import com.example.app.exception.ApiInvalidUpdateException;
import com.example.app.mapper.ProductMapper;
import com.example.app.service.FileUploadService;
import com.example.app.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

  private final ProductMapper productMapper;

  private final FileUploadService fileUploadService;


  @Override
  public List<ProductDto> getProductList() {
    List<ProductDto> productList = productMapper.getProductList();
    return productList;
  }

  public void createProduct(String name, String description, int price, int stock, MultipartFile imageFile) throws Exception {
    // 商品を保存
    if (productMapper.createProduct(name, description, price, stock) == 0) {
      throw new ApiInvalidUpdateException("登録に失敗しました。");
    }

    // 画像があれば、S3にアップロード
    if (imageFile != null) {
//      fileUploadService.uploadImage()
    }
  }

}
