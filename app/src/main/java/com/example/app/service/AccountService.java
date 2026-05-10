package com.example.app.service;

import com.example.app.dto.AccountDto;
import com.example.app.dto.AddressDto;

import java.util.List;

public interface AccountService {
  AccountDto findByEmail(String email);

  void register(String name, String email, String password, List<AddressDto> addressList);

  AccountDto insertAccount(String name, String email, String password);
}
