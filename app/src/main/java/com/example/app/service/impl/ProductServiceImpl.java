package com.example.app.service.impl;

import com.example.app.dto.ProductDto;
import com.example.app.dto.S3FileDto;
import com.example.app.enums.EntityType;
import com.example.app.exception.ApiInvalidUpdateException;
import com.example.app.mapper.ProductMapper;
import com.example.app.mapper.S3FileMapper;
import com.example.app.service.FileUploadService;
import com.example.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

  // =====================================================================
  // Constant
  // =====================================================================

  // =====================================================================
  // DI
  // =====================================================================
  private final ProductMapper productMapper;

  private final S3FileMapper s3FileMapper;

  private final FileUploadService fileUploadService;


  @Override
  public List<ProductDto> getProductList() {
    List<ProductDto> productList = productMapper.getProductList();
    return productList;
  }

  @Override
  @Transactional
  public void createProduct(ProductDto product, MultipartFile imageFile) throws Exception {

    if (productMapper.createProduct(product) == 0) {
      throw new ApiInvalidUpdateException("商品登録に失敗しました。");
    }

    // 画像があれば、S3にアップロードし、prefixをDBに保存
    if (imageFile != null) {
      String imageUrl = fileUploadService.uploadImage(EntityType.PRODUCT.name(), product.getId(), imageFile);

      S3FileDto s3File = new S3FileDto();
      s3File.setEntityId(product.getId());
      s3File.setEntityType(EntityType.PRODUCT);
      s3File.setS3Path(imageUrl);

      if (s3FileMapper.insertS3File(s3File) == 0) {
        throw new ApiInvalidUpdateException("商品画像URLの更新に失敗しました。");
      }
    }
  }

}
