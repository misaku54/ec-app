package com.example.app.util;

import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;

public class S3Util {

  public static String putFile(S3Client s3Client, MultipartFile imageFile, String bucketName ,String objectKey) throws IOException {
    try (InputStream inputStream = imageFile.getInputStream()) {
      PutObjectRequest putRequest = PutObjectRequest.builder()
        .bucket(bucketName)
        .key(objectKey)
        .contentType(imageFile.getContentType())
        .build();

      s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, imageFile.getSize()));
      return objectKey;
    }
  }

}
