package com.example.app.form;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class OrderCreateForm {
  @NotBlank(message = "{require}")
  @Size(max = 255)
  private String shippingName;

  @NotBlank(message = "{require}")
  @Pattern(regexp = "^\\d{3}-\\d{4}$", message = "郵便番号はXXX-XXXXの形式で入力してください")
  private String shippingPostalCode;

  @NotBlank(message = "{require}")
  private String shippingAddress;

  @Size(max = 20)
  private String shippingPhone;

  private String note;

  @Valid
  @Size(min = 1, message = "1件以上の商品が必要です")
  private List<OrderItemForm> items;
}
