package com.example.app.dto;

import lombok.Data;

@Data
public class ResponseDto<T> {

  private String status;
  private T data;

  public static <T> ResponseDto<T> success(T data) {
    ResponseDto<T> response = new ResponseDto<>();
    response.setStatus("success");
    response.setData(data);
    return response;
  }

  public static ResponseDto<Void> success() {
    ResponseDto<Void> response = new ResponseDto<>();
    response.setStatus("success");
    return response;
  }

}
