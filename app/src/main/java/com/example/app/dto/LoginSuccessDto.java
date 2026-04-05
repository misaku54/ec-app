package com.example.app.dto;

import lombok.Data;

import java.util.List;

@Data
public class LoginSuccessDto {

  String message;

  List<String> roles;

}
