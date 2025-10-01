package com.example.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SampleDto {
  private String body;
  private int statusCode;
}
