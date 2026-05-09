package com.example.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseListDto<T> {
  private String status;
  private List<T> data;
  private PageInfoDto pageInfo;
}
