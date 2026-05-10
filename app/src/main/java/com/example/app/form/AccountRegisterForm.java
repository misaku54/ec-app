package com.example.app.form;

import com.example.app.dto.AddressDto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class AccountRegisterForm {

  @NotBlank(message="{require}")
  private String name;
  @NotBlank(message="{require}")
  private String email;
  @NotBlank(message="{require}")
  private String password;

  private List<AddressDto> addressList;

}
