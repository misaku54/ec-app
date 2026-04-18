package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDetailDto {
  private Integer id;
  private String name;
  private String description;
  private int price;
  private int stock;
  private List<ProductImageDto> productImageList;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
