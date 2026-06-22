package com.example.app.dto;

import lombok.Data;

@Data
public class OrderItemDetailDto {
  private Integer productId;
  private String productName;
  private Integer unitPrice;
  private Integer quantity;
  private String currentImageS3Key;
}
