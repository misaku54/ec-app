package com.example.app.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "aws")
public class AwsLocalProperties {

  private String endpoint;

  private String region;

  private String minioUser;

  private String minioPass;

  private S3 s3;

  @Data
  public static class S3 {
    private String bucketName;
  }
}
