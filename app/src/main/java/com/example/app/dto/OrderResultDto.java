package com.example.app.dto;

import lombok.Data;

@Data
public class OrderResultDto {
  private int orderId;
  private int totalAmount;
  private String status;
}
