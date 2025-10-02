package com.example.app.dto;

import lombok.Data;

@Data
public class ResponseDto<T> {
  private T data;
}
