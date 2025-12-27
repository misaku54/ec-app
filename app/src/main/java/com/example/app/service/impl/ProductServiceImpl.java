package com.example.app.service.impl;

import com.example.app.dto.ProductDetailDto;
import com.example.app.dto.ProductDto;
import com.example.app.dto.S3FileDto;
import com.example.app.enums.EntityType;
import com.example.app.exception.ApiInvalidUpdateException;
import com.example.app.exception.ApiNotFoundException;
import com.example.app.mapper.ProductMapper;
import com.example.app.mapper.S3FileMapper;
import com.example.app.service.FileUploadService;
import com.example.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

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
  public ProductDetailDto getProductDetail(int productId) {
    ProductDetailDto productDetail = productMapper.getProductDetailById(productId);
    if (Objects.isNull(productDetail)) {
      throw new ApiNotFoundException("指定された商品は見つかりませんでした。");
    }

    return productDetail;
  }

  @Override
  @Transactional
  public ProductDetailDto createProduct(ProductDto product, List<MultipartFile> imageFiles) throws Exception {

    if (productMapper.createProduct(product) == 0) {
      throw new ApiInvalidUpdateException("商品登録に失敗しました。");
    }

    int createdProductId = product.getId();
    if (!CollectionUtils.isEmpty(imageFiles)) {
      uploadAndSaveProductImage(createdProductId, imageFiles);
    }

    return productMapper.getProductDetailById(createdProductId);
  }

  @Override
  @Transactional
  public void updateProduct(ProductDto product, MultipartFile imageFile) throws Exception {

    if (productMapper.updateProduct(product) == 0) {
      throw new ApiNotFoundException("指定された商品は見つかりませんでした。");
    }

    if (Objects.isNull(imageFile)) {
      return;
    }

    String objectKey = s3FileMapper.getS3FilePathByEntityTypeAndId(
      EntityType.PRODUCT,
      product.getId()
    );

    if (Objects.isNull(objectKey)) {
//      uploadAndSaveProductImage(product.getId(), imageFile);
    } else {
      fileUploadService.uploadImage(objectKey, imageFile);
    }
  }

  private void uploadAndSaveProductImage(int productId, List<MultipartFile> imageFiles) throws Exception {
    for (int sortOrder = 0; sortOrder < imageFiles.size(); sortOrder++) {
      String objectKey = fileUploadService.generateOjbectKey(EntityType.PRODUCT, productId, sortOrder);
      MultipartFile imageFile = imageFiles.get(sortOrder);

      // イメージアップロード
      fileUploadService.uploadImage(objectKey, imageFile);

      S3FileDto s3File = new S3FileDto();
      s3File.setEntityId(productId);
      s3File.setEntityType(EntityType.PRODUCT);
      s3File.setS3Key(objectKey);
      s3File.setSortOrder(sortOrder);
      s3File.setMainImage(sortOrder == 0);

      // アップロードしたパスをテーブルに保存
      if (s3FileMapper.insertS3File(s3File) == 0) {
        throw new ApiInvalidUpdateException("商品画像URLの更新に失敗しました。");
      }
    }

  }

  @Override
  @Transactional
  public void deleteProduct(int productId) {
    if (productMapper.deleteProduct(productId) == 0) {
      throw new ApiInvalidUpdateException("指定された商品は見つかりませんでした。");
    }

    s3FileMapper.deleteS3File(EntityType.PRODUCT, productId);
  }
}
