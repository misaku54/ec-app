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

  @Override
  public String uploadImage(String prefix, Integer id, MultipartFile imageFile) throws Exception {
    String fileName = imageFile.getOriginalFilename() != null ? imageFile.getOriginalFilename() : "image.png";
    String objectKey = prefix + "/" + id + "/" + fileName;

    S3Util.putFile(s3Client, imageFile, bucketName, objectKey);
    return objectKey;
  }

  @Override
  public String getImageUrl(String objectKey) {
    return "https://" + bucketName + ".s3.ap-northeast-1.amazonaws.com/" + objectKey;
  }
}
