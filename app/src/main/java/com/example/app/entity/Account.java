package com.example.app.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class Account {
  private int id;
  private String name;
  private String email;
}
