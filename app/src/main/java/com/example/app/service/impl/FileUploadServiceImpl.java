package com.example.app.service.impl;

import com.example.app.service.FileUploadService;
import com.example.app.util.S3Util;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

  @Value("${aws.s3.bucket-name}")
  private String bucketName;

  private final S3Client s3Client;

  // オブジェクト名までのパスを生成しS3へアップロード(例：sample/商品画像/12345/main.jpg)
  // オブジェクトパスを返却
  // 商品登録（画像オブジェクトパス以外）→　画像をS3にアップロード、オブジェクトパス返却　→ 登録したレコードのオブジェクトパスを更新
  // トランザクションはる
  @Override
  public String uploadImage(String prefix, int id, MultipartFile imageFile) throws IOException {
    String fileName = imageFile.getOriginalFilename() != null ? imageFile.getOriginalFilename() : "image.png";
    String objectKey = "/" + prefix + "/" + id + "/" + fileName;

    return S3Util.putFile(s3Client, imageFile, bucketName, objectKey);
  }
}
