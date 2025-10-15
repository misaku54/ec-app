package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductDto {
  private Integer id;
  private String name;
  private String description;
  private int price;
  private int stock;
  private String s3Path;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
