package com.example.app.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Objects;

@Slf4j
public class S3Util {

  public static void putFile(S3Client s3Client, MultipartFile imageFile, String bucketName ,String objectKey) throws IOException {
    try {
      PutObjectRequest putRequest = PutObjectRequest.builder()
        .bucket(bucketName)
        .key(objectKey)
        .contentType(imageFile.getContentType())
        .build();

      s3Client.putObject(putRequest, RequestBody.fromBytes(imageFile.getBytes()));
    } catch (Exception e) {
      log.error("S3オブジェクトの取得に失敗しました。bucket={} and fileName={}. Error:{}",
        bucketName, objectKey, e.getMessage() ,e);
      throw e;
    }
  }

  public static void deleteFiles(S3Client s3Client, String bucketName, List<String> objectKeys) throws IOException{
    List<ObjectIdentifier> keys = objectKeys.stream()
      .filter(Objects::nonNull)
      .map(key -> ObjectIdentifier.builder().key(key).build())
      .toList();

    Delete del = Delete.builder().objects(keys).build();

    try {
      DeleteObjectsRequest multiObjectDeleteRequest = DeleteObjectsRequest.builder()
        .bucket(bucketName)
        .delete(del)
        .build();

      s3Client.deleteObjects(multiObjectDeleteRequest);
    } catch (Exception e) {
      log.error("S3オブジェクトの削除に失敗しました。bucket={} and fileName={}. Error:{}",
        bucketName, objectKeys, e.getMessage() ,e);
      throw e;
    }
  }

}
