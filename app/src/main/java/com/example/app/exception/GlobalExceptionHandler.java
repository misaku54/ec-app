package com.example.app.exception;

import com.example.app.dto.ResponseErrorDto;
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
    log.error("Apiエラーが発生しました。入力値を確認してください。", ex);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
  }

  @ExceptionHandler(ApiNotFoundException.class)
  public ResponseEntity<ResponseErrorDto> handleApiNotFound(ApiNotFoundException ex) {
    log.warn("データが見つかりませんでした。", ex);
    ResponseErrorDto responseError = new ResponseErrorDto(
      HttpStatus.NOT_FOUND.value(),
      HttpStatus.NOT_FOUND.getReasonPhrase(),
      ex.getMessage()
    );

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseError);
  }

  // DBアクセスエラーハンドリング
  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<ResponseErrorDto> handleDataAccess(DataAccessException ex) {
    log.error("データベース操作中にエラーが発生しました。", ex);
    ResponseErrorDto responseError = new ResponseErrorDto(
      HttpStatus.INTERNAL_SERVER_ERROR.value(),
      HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
      ex.getMessage()
    );

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseError);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleGeneral(Exception ex) {
    log.error("予期しないエラーが発生しました。", ex);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
  }

}