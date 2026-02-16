package com.example.app.exception;

public class ApiInvalidUpdateException extends RuntimeException {
  public ApiInvalidUpdateException(String message) {
    super(message);
  }
}
