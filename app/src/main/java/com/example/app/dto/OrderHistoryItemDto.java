package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderHistoryItemDto {
  private Integer id;
  private Integer totalAmount;
  private String status;
  private LocalDateTime createdAt;
}
