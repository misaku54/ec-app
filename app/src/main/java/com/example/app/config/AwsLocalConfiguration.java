package com.example.app.config;

import com.example.app.properties.AwsLocalProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class AwsLocalConfiguration {

  @Bean
  public S3Client s3ClientCreate(AwsLocalProperties awsLocalProperties) {
    return S3Client.builder()
      .endpointOverride(URI.create(awsLocalProperties.getEndpoint()))
      .region(Region.of(awsLocalProperties.getRegion()))
      .credentialsProvider(StaticCredentialsProvider.create(
        AwsBasicCredentials.create(awsLocalProperties.getMinioUser(), awsLocalProperties.getMinioPass())
      ))
      .serviceConfiguration(S3Configuration.builder()
        .pathStyleAccessEnabled(true)  // SDKはデフォルトで仮想ホスト形式でアクセスするがminio用パススベース形式のため、パスベース形式を強制
        .build())
      .build();
  }
}
