package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDetailDto {
  private Integer id;
  private String status;
  private Integer totalAmount;
  private String shippingName;
  private String shippingPostalCode;
  private String shippingAddress;
  private String shippingPhone;
  private String note;
  private LocalDateTime createdAt;
  private List<OrderItemDetailDto> orderItems;
}
