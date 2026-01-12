package com.example.app.service.impl;

import com.example.app.dto.*;
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
    return productMapper.getProductList();
  }

  @Override
  public ProductDetailDto getProductDetail(int productId) {
    return detailProductInfo(productId);
  }

  @Override
  @Transactional
  public ProductDetailDto createProduct(ProductDto product, List<MultipartFile> imageFiles) throws Exception {
    // 商品登録
    createProductInfo(product);

    // 画像をS3アップロード＆画像URL登録
    int createdProductId = product.getId();
    uploadAndSaveProductImage(createdProductId, imageFiles);

    // 登録後、商品詳細を返却する
    return detailProductInfo(createdProductId);
  }

  @Override
  @Transactional
  public void updateProduct(ProductDto product, List<ImageUpdateDto> existingImages) throws Exception {

    updateProductInfo(product);

    if (CollectionUtils.isEmpty(existingImages)) {
      return;
    }

    List<String> objectKeys = s3FileMapper.getS3FileKeyByEntityTypeAndId(
      EntityType.PRODUCT,
      product.getId()
    );

    if (Objects.isNull(objectKeys)) {
//      uploadAndSaveProductImage(product.getId(), imageFile);
    } else {
//      fileUploadService.uploadImage(objectKey, imageFile);
    }
  }

  private void uploadAndSaveProductImage(int productId, List<MultipartFile> imageFiles) throws Exception {
    if (CollectionUtils.isEmpty(imageFiles)) {
      return;
    }

    for (int sortOrder = 0; sortOrder < imageFiles.size(); sortOrder++) {
      String objectKey = fileUploadService.generateObjectKey(EntityType.PRODUCT, productId, sortOrder);
      MultipartFile imageFile = imageFiles.get(sortOrder);

      fileUploadService.uploadImage(objectKey, imageFile);

      S3FileDto s3File = new S3FileDto();
      s3File.setEntityId(productId);
      s3File.setEntityType(EntityType.PRODUCT);
      s3File.setS3Key(objectKey);
      s3File.setSortOrder(sortOrder);
      s3File.setMainImage(sortOrder == 0);

      if (s3FileMapper.insertS3File(s3File) == 0) {
        throw new ApiInvalidUpdateException("商品画像URLの更新に失敗しました。");
      }
    }

  }

  @Override
  @Transactional
  public ProductDeleteDto deleteProduct(int productId) throws Exception {
    if (productMapper.deleteProduct(productId) == 0) {
      throw new ApiInvalidUpdateException("指定された商品は見つかりませんでした。");
    }
    List<String> objectKeys = s3FileMapper.getS3FileKeyByEntityTypeAndId(EntityType.PRODUCT, productId);
    int deleteImageCount = fileUploadService.deleteImages(objectKeys);

    s3FileMapper.deleteS3FileByEntityTypeAndId(EntityType.PRODUCT, productId);

    // 削除用レスポンスを整形
    ProductDeleteDto dto = new ProductDeleteDto();
    dto.setProductId(productId);
    dto.setDeletedImageCount(deleteImageCount);
    return dto;
  }

  public ProductDetailDto detailProductInfo(int productId) {
    ProductDetailDto productDetail = productMapper.getProductDetailById(productId);
    if (Objects.isNull(productDetail)) {
      throw new ApiNotFoundException("指定された商品は見つかりませんでした。");
    }
    return productDetail;
  }

  public S3FileDto getS3FileById(int id) {
    S3FileDto s3File = s3FileMapper.getS3FileById(id);
    if (Objects.isNull(s3File)) {
      throw new ApiNotFoundException("不正なリクエストです。");
    }
    return s3File;
  }

  public void createProductInfo(ProductDto product) {
    if (productMapper.createProduct(product) == 0) {
      throw new ApiInvalidUpdateException("商品登録に失敗しました。");
    }
  }

  public void updateProductInfo(ProductDto product) {
    if (productMapper.updateProduct(product) == 0) {
      throw new ApiNotFoundException("指定された商品は見つかりませんでした。");
    }
  }

  public void updateS3FileOrderAndMainImageById(int id, int sortOrder, boolean isMainImage) {
    if (s3FileMapper.updateS3FileOrderAndMainImageById(id, sortOrder, isMainImage) == 0) {
      throw new ApiNotFoundException("不正なリクエストです。");
    }
  }

  public void deleteS3FileById(int id) {
    if (s3FileMapper.deleteS3FileById(id) == 0) {
      throw new ApiNotFoundException("不正なリクエストです。");
    }
  }

  private void processExistingImages(int productId, List<ImageUpdateDto> existingImages) throws Exception {
    if (CollectionUtils.isEmpty(existingImages)) {
      return;
    }

    for (ImageUpdateDto image : existingImages) {

      switch (image.getAction()) {
        // 既存画像の更新
        case "keep" -> {
          S3FileDto s3File = getS3FileById(image.getId());
          // sortOrderとメインイメージ更新
          updateS3FileOrderAndMainImageById(
            s3File.getId(),
            image.getSortOrder(),
            image.isMainImage());

          // イメージがあったらストレージのイメージを入れ替え
          fileUploadService.uploadImage(s3File.getS3Key(), image.getFile());
        }
        // 画像の削除
        case "delete" -> {
          S3FileDto s3File = getS3FileById(image.getId());
          deleteS3FileById(s3File.getId());
        }
        // 新規画像の追加
        case "add" -> {
          int newSort = image.getSortOrder();
          String objectKey = fileUploadService.generateObjectKey(EntityType.PRODUCT, productId, image.getSortOrder());
          fileUploadService.uploadImage(objectKey, image.getFile());

          S3FileDto new3File = new S3FileDto();
          new3File.setEntityId(productId);
          new3File.setEntityType(EntityType.PRODUCT);
          new3File.setS3Key(objectKey);
          new3File.setSortOrder(newSort);
          new3File.setMainImage(image.isMainImage());
        }
      }
    }
  }
}
