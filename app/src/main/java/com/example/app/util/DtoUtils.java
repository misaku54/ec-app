package com.example.app.util;

import com.example.app.dto.ValidationErrorDto;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;

import java.util.Locale;

public class DtoUtils {

  public static ValidationErrorDto toValidationErrorDto(BindingResult bindingResult, MessageSource messageSource, Locale locale) {
    ValidationErrorDto validationErrorDto = new ValidationErrorDto();
    validationErrorDto.setStatus(HttpStatus.BAD_REQUEST.value());
    validationErrorDto.setError("入力内容にエラーがあります");

    bindingResult.getGlobalErrors().forEach((error) -> {
      validationErrorDto.addGlobalError(messageSource.getMessage(error.getCode(), error.getArguments(), error.getDefaultMessage(), locale));
    });
    bindingResult.getFieldErrors().forEach((error) -> {
      validationErrorDto.addFieldError(error.getField(), messageSource.getMessage(error.getCode(), error.getArguments(), error.getDefaultMessage(), locale));
    });

    return validationErrorDto;
  }

}
