package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductDetailDto {
  private Integer id;
  private String name;
  private String description;
  private int price;
  private int stock;
  private String imageUrl;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
