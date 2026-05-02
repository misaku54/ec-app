package com.example.app.form;

import lombok.Data;

@Data
public class ProductSearchParam {
  private String name;
  private Integer maxPrice;
  private Integer minPrice;
  private Boolean inStock;
}
