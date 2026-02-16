package com.example.app.exception;


import com.example.app.dto.ApiErrorDto;
import com.example.app.dto.ValidationErrorDto;
import lombok.Data;

@Data
public class ErrorMessageException extends RuntimeException {

  private ValidationErrorDto validationErrorDto;
  private ApiErrorDto apiErrorDto;

  public ErrorMessageException(ValidationErrorDto validationErrorDto) {
    super(validationErrorDto.getError());
    this.validationErrorDto = validationErrorDto;
  }

  public ErrorMessageException(ApiErrorDto apiErrorDto) {
    super(apiErrorDto.getError());
    this.apiErrorDto = apiErrorDto;
  }

}
