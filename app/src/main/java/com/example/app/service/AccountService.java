package com.example.app.service;

import com.example.app.dto.AccountDto;

public interface AccountService {
  AccountDto findByEmail(String email);

  void register(String name, String email, String password);

  AccountDto insertAccount(String name, String email, String password);
}
