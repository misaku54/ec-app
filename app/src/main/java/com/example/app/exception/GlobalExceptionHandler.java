package com.example.app.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
  // APIエラーハンドリング
  @ExceptionHandler(ApiInvalidUpdateException.class)
  public ResponseEntity<String> handleApiInvalidUpdate(ApiInvalidUpdateException ex) {
    log.error("ApiInvalidUpdateException occurred", ex);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
  }

  // DBアクセスエラーハンドリング
  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<String> handleDataAccess(DataAccessException ex) {
    log.error("DataAccessException occurred", ex);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
  }
}
