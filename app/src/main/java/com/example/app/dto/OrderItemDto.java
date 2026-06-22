package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderItemDto {
  private Integer id;
  private Integer orderId;
  private Integer productId;
  private String productName;
  private Integer unitPrice;
  private Integer quantity;
  private LocalDateTime createdAt;
}
