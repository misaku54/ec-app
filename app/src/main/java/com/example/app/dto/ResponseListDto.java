package com.example.app.dto;

import lombok.Data;

import java.util.List;

@Data
public class ResponseListDto<T> {
  private List<T> data;
}
