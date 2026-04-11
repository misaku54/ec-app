package com.example.app.service;

import com.example.app.dto.AccountDto;

public interface AccountService {
  AccountDto findByEmail(String email);
}
