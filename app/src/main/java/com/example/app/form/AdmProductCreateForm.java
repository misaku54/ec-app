package com.example.app.form;

import lombok.Data;

@Data
public class AdmProductCreateForm {
  private String name;
  private String description;
  private int price;
  private int stock;
}
