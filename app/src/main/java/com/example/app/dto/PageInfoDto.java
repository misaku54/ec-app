package com.example.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PageInfoDto {
  private long totalCount;
  private int totalPage;
  private int currentPage;
  private int size;
}
