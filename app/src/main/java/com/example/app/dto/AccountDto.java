package com.example.app.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AccountDto {
  private Integer id;
  private String name;
  private String email;
  private String password;
  private List<String> roles;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
