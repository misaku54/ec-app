package com.example.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseErrorDto {

  private int code;

  private String status;

  private String message;

}
