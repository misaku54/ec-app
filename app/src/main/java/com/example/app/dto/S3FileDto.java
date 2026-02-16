package com.example.app.dto;

import com.example.app.enums.EntityType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class S3FileDto {

  private int id;

  private EntityType entityType;

  private int entityId;

  private String s3Key;

  private int sortOrder;

  private boolean isMainImage;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

}
