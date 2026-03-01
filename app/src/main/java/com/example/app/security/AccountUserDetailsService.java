package com.example.app.security;

import com.example.app.dto.AccountDto;
import com.example.app.mapper.AccountMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
@RequiredArgsConstructor
public class AccountUserDetailsService implements UserDetailsService {

  // =====================================================================
  // Constant
  // =====================================================================

  // =====================================================================
  // DI
  // =====================================================================
  private final AccountMapper accountMapper;

  @Override
  public UserDetails loadUserByUsername(String email) {

    AccountDto account = accountMapper.findByEmail(email)
      .orElseThrow(() -> new UsernameNotFoundException(email));

    return User.withUsername(account.getEmail())
      .password(account.getPassword())
      .roles(account.getRoles().toArray(new String[0]))
      .build();
  }

}
