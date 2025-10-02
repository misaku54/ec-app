package com.example.app.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdmProductCreateForm {
  @NotBlank
  private String name;

  private String description;

  @NotNull
  private int price;

  @NotNull
  private int stock;
}
