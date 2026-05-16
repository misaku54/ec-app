package com.example.app.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class ValidationErrorDto extends ErrorDto {
  private List<String> globalError = new ArrayList<>();
  private Map<String, List<String>> fieldError = new HashMap<>();

  public void addGlobalError(String message) {
    this.globalError.add(message);
  }

  public void addFieldError(String field, String message) {
    this.fieldError.computeIfAbsent(field, key -> new ArrayList<>());
    this.fieldError.get(field).add(message);
  }

}
