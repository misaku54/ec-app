package com.example.app.exception;

public class ApiConflictException extends RuntimeException {
  public ApiConflictException(String message) {
    super(message);
  }
}
