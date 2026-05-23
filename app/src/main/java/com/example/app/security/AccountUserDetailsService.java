package com.example.app.security;

import com.example.app.dto.AccountDto;
import com.example.app.mapper.AccountMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


/**
 * Spring Securityでは、ユーザー情報は通常UserDetailsServiceを介して取得されます。
 * このインターフェースを実装したクラスにより、データベースからユーザー名に紐づく情報を取得し、
 * それをUserDetailsオブジェクトとして返します。取得されたユーザー情報は、入力されたパスワードと照合されますが、
 * この際にPasswordEncoderが使用され、暗号化されたパスワードとの一致を確認します。
 */
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

    return new CustomUserDetails(account);
  }

}
