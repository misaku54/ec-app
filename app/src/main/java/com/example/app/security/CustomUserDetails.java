package com.example.app.security;

import com.example.app.dto.AccountDto;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails extends User {

  private final AccountDto account;

  public CustomUserDetails(AccountDto account) {
    super(
      account.getEmail(),
      account.getPassword(),
      toAuthorities(account.getRoles()));

    this.account = account;
  }

  private static List<GrantedAuthority> toAuthorities(List<String> roles) {
    return roles.stream().
                filter(Objects::nonNull).
                map((role) -> new SimpleGrantedAuthority("ROLE_" + role)).
                collect(Collectors.toList());
  }
}
