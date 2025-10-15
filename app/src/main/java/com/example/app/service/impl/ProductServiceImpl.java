package com.example.app.service.impl;

import com.example.app.dto.ProductDto;
import com.example.app.exception.ApiInvalidUpdateException;
import com.example.app.mapper.ProductMapper;
import com.example.app.service.FileUploadService;
import com.example.app.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

  private final String S3_PRODUCT_PREFIX = "PRODUCTS";

  private final ProductMapper productMapper;

  private final FileUploadService fileUploadService;



  @Override
  public List<ProductDto> getProductList() {
    List<ProductDto> productList = productMapper.getProductList();
    return productList;
  }

  @Override
  @Transactional
  public void createProduct(ProductDto product, MultipartFile imageFile) throws Exception {

    // 商品を保存
    if (productMapper.createProduct(product) == 0) {
      throw new ApiInvalidUpdateException("商品登録に失敗しました。");
    }

    // 画像があれば、S3にアップロードし、prefixをDBに保存
    if (imageFile != null ) {
      String imageUrl = fileUploadService.uploadImage(S3_PRODUCT_PREFIX, product.getId() ,imageFile);

      product.setS3Path(imageUrl);
      if (productMapper.updateProductUrl(product) == 0) {
        throw new ApiInvalidUpdateException("商品画像URLの更新に失敗しました。");
      }
    }
  }

}
