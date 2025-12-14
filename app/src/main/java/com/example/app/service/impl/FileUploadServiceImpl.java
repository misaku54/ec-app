package com.example.app.service.impl;

import com.example.app.enums.EntityType;
import com.example.app.service.FileUploadService;
import com.example.app.util.S3Util;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

  @Value("${aws.s3.bucket-name}")
  private String bucketName;

  private final S3Client s3Client;

  @Override
  public String generateOjbectKey(EntityType entityType, Integer id) throws Exception {
    String prefix = entityType.name();

    switch (entityType) {
      case PRODUCT -> {
        return prefix + "/" + id + "/product.png";
      }
      case USER -> {
        return prefix + "/" + id + "/user.png";
      }
      default -> throw new Exception();
    }
  }

  @Override
  public void uploadImage(String objectKey, MultipartFile imageFile) throws Exception {
    if (Objects.isNull(objectKey)) {
      throw new Exception();
    }
    S3Util.putFile(s3Client, imageFile, bucketName, objectKey);
  }

  @Override
  public String getImageUrl(String objectKey) {
    if (Objects.isNull(objectKey)) {
      return null;
    }
    // TODO:本番はhttps://my-bucket.s3.ap-northeast-1.amazonaws.com/PRODUCT/10/product.pngとなる
    // ymlファイルなどでローカルと本番で切り替えられるように修正する
    return "http://localhost:9000/" + bucketName + "/" + objectKey;
  }
}
