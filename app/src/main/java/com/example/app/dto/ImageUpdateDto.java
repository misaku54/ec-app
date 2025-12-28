package com.example.app.dto;

import lombok.Data;

@Data
public class ImageUpdateDto {

  private String s3Key;

  private int sortOrder;

  private boolean isMainImage;

  private boolean delFlg;

}
