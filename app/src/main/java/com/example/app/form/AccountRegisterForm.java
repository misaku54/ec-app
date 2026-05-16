package com.example.app.form;

import com.example.app.valdation.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccountRegisterForm {

  @NotBlank(message="{require}")
  @Email(message = "メールアドレスの形式が無効です")
  private String email;

  @NotBlank(message="{require}")
  @StrongPassword
  private String password;

  @NotBlank(message="{require}")
  private String name;

}
