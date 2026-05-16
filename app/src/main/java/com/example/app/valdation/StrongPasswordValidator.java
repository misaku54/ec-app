package com.example.app.valdation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

  @Override
  public boolean isValid(String password, ConstraintValidatorContext context) {
    if (password == null || password.isBlank()) {
      return true; // @NotBlank に任せる
    }
    return password.length() >= 8
        && password.chars().anyMatch(Character::isUpperCase)
        && password.chars().anyMatch(Character::isLowerCase)
        && password.chars().anyMatch(Character::isDigit);
  }
}
