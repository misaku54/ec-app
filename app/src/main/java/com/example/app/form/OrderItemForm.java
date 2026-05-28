package com.example.app.form;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemForm {
  @NotNull
  private Integer productId;

  @NotNull
  @Min(1)
  private Integer quantity;
}
