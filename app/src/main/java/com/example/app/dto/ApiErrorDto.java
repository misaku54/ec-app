package com.example.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
public class ApiErrorDto extends ErrorDto {
  private String message;

  public ApiErrorDto(String message, HttpStatus status) {
    this.setStatus(status.value());
    this.setError(status.getReasonPhrase());
    this.setMessage(message);
  }
}
