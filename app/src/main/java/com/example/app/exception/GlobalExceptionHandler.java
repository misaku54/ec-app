package com.example.app.exception;

import com.example.app.dto.ErrorResponseDto;
import com.example.app.dto.ValidationErrorDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  // カスタムバリデーションエラーをキャッチ
  @ExceptionHandler(ErrorMessageException.class)
  public ResponseEntity<ErrorResponseDto> handleErrorMessageException(ErrorMessageException ex) {
    ErrorResponseDto response;

    if (ex.getValidationErrorDto() != null) {
      ValidationErrorDto v = ex.getValidationErrorDto();
      response = ErrorResponseDto.ofValidation(
        v.getStatus(),
        v.getError(),
        v.getFieldError()
      );
    } else {
      response = ErrorResponseDto.of(
        ex.getApiErrorDto().getStatus(),
        ex.getApiErrorDto().getMessage()
      );
    }

    try {
      log.warn(new ObjectMapper().writeValueAsString(response));
    } catch (JsonProcessingException e) {
      log.error("ErrorResponseDtoをJSONに変換できませんでした", e);
    }

    return ResponseEntity.status(response.getError().getCode()).body(response);
  }

  // API処理中のエラーをキャッチ
  @ExceptionHandler(ApiInvalidUpdateException.class)
  public ResponseEntity<ErrorResponseDto> handleApiInvalidUpdate(ApiInvalidUpdateException ex) {
    log.error("Apiエラーが発生しました。入力値を確認してください。", ex);
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(ErrorResponseDto.of(HttpStatus.BAD_REQUEST.value(), ex.getMessage()));
  }

  @ExceptionHandler(ApiNotFoundException.class)
  public ResponseEntity<ErrorResponseDto> handleApiNotFound(ApiNotFoundException ex) {
    log.warn("データが見つかりませんでした。", ex);
    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(ErrorResponseDto.of(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
  }

  @ExceptionHandler(ApiConflictException.class)
  public ResponseEntity<ErrorResponseDto> handleApiConflict(ApiConflictException ex) {
    log.warn("データが重複してます。", ex);
    return ResponseEntity
      .status(HttpStatus.CONFLICT)
      .body(ErrorResponseDto.of(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
  }

  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<ErrorResponseDto> handleDataAccess(DataAccessException ex) {
    log.error("データベース操作中にエラーが発生しました。", ex);
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(ErrorResponseDto.of(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage()));
  }

  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ErrorResponseDto> handleNoResourceFound(NoResourceFoundException ex) {
    log.error("ページが見つかりませんでした。");
    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(ErrorResponseDto.of(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponseDto> handleGeneral(Exception ex) {
    log.error("予期しないエラーが発生しました。", ex);
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(ErrorResponseDto.of(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage()));
  }
}