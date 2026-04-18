package com.example.app.dto;

import lombok.Data;

import java.util.List;

@Data
public class MeDto {

  private Integer id;

  private String email;

  private List<String> roles;

}
