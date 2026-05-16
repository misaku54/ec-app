package com.example.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class ErrorResponseDto {

  private String status = "error";
  private ErrorDetail error;

  @Data
  @NoArgsConstructor
  public static class ErrorDetail {
    private int code;
    private String message;
    private Map<String, List<String>> fieldError;

    public ErrorDetail(int code, String message) {
      this.code = code;
      this.message = message;
    }

    public ErrorDetail(int code, String message, Map<String, List<String>> fieldError) {
      this.code = code;
      this.message = message;
      this.fieldError = fieldError;
    }
  }

  public static ErrorResponseDto of(int code, String message) {
    ErrorResponseDto dto = new ErrorResponseDto();
    dto.setError(new ErrorDetail(code, message));
    return dto;
  }

  public static ErrorResponseDto ofValidation(int code, String message, Map<String, List<String>> fieldError) {
    ErrorResponseDto dto = new ErrorResponseDto();
    dto.setError(new ErrorDetail(code, message, fieldError));
    return dto;
  }
}
