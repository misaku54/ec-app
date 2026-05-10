package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressDto {
  @NotBlank(message = "{require}")
  private String postal_code;

  @NotBlank(message = "{require}")
  private String name;

  @NotBlank(message = "{require}")
  private String address;

  private String phone; // 任意項目
}
