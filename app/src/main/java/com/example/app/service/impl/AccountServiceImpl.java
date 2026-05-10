package com.example.app.service.impl;

import com.example.app.dto.AccountDto;
import com.example.app.dto.AddressDto;
import com.example.app.dto.RoleDto;
import com.example.app.exception.ApiConflictException;
import com.example.app.exception.ApiNotFoundException;
import com.example.app.mapper.AccountMapper;
import com.example.app.mapper.AccountRoleMapper;
import com.example.app.mapper.AddressMapper;
import com.example.app.mapper.RoleMapper;
import com.example.app.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

  private final AccountMapper accountMapper;
  private final AccountRoleMapper accountRoleMapper;
  private final RoleMapper roleMapper;
  private final AddressMapper addressMapper;
  private final PasswordEncoder passwordEncoder;
  private final String ROLE_USER = "USER";

  @Override
  public AccountDto findByEmail(String email) {
    return accountMapper.findByEmail(email).orElseThrow(() -> new ApiNotFoundException("不正なリクエストです。"));
  }

  @Override
  @Transactional
  public void register(String name, String email, String password, List<AddressDto> addressList) {
    Optional<AccountDto> account = accountMapper.findByEmail(email);
    if (account.isPresent()) {
      throw new ApiConflictException("すでに登録されているメールアドレスです");
    }

    Optional<RoleDto> role = roleMapper.findByName(ROLE_USER);
    if (role.isEmpty()) {
      throw new ApiNotFoundException("登録可能な権限がありません。管理者に問い合わせください");
    }

    AccountDto insertedAccount = this.insertAccount(name, email, password);
    addressMapper.insertAddresses(addressList, insertedAccount.getId());
    accountRoleMapper.insertAccountRole(insertedAccount.getId(), role.get().getId());

  }

  @Override
  public AccountDto insertAccount(String name, String email, String password) {
    String hashedPassword = passwordEncoder.encode(password);

    AccountDto account = new AccountDto();
    account.setEmail(email);
    account.setName(name);
    account.setPassword(hashedPassword);
    accountMapper.insertAccount(account);

    return account;
  }
}
