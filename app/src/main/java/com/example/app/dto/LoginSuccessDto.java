package com.example.app.dto;

import lombok.Data;

import java.util.List;

@Data
public class LoginSuccessDto {

  String message;

  Boolean authenticated;

  List<String> roles;

}
