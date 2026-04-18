package com.example.app.service.impl;

import com.example.app.dto.AccountDto;
import com.example.app.exception.ApiNotFoundException;
import com.example.app.mapper.AccountMapper;
import com.example.app.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

  private final AccountMapper accountMapper;

  @Override
  public AccountDto findByEmail(String email) {
    return accountMapper.findByEmail(email).orElseThrow(() -> new ApiNotFoundException("不正なリクエストです。"));
  }
}
