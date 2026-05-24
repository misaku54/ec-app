package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDto {
  private Integer id;
  private Integer accountId;
  private String status;
  private Integer totalAmount;
  private String shippingName;
  private String shippingPostalCode;
  private String shippingAddress;
  private String shippingPhone;
  private String note;
  private Boolean delFlg;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
