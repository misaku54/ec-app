package com.example.app.dto;

import lombok.Data;

@Data
public class ProductImageDto {

  private String s3Key;

  private int sortOrder;

  private boolean mainImage;

}
