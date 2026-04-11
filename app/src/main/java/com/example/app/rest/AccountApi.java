package com.example.app.rest;

import com.example.app.dto.AccountDto;
import com.example.app.dto.MeDto;
import com.example.app.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class AccountApi {

  private final AccountService accountService;

  @GetMapping("/me")
  public MeDto getMe(@AuthenticationPrincipal UserDetails user) {
    String email = user.getUsername();

    AccountDto account = accountService.findByEmail(email);

    MeDto me = new MeDto();
    me.setId(account.getId());
    me.setEmail(account.getEmail());
    me.setRoles(account.getRoles());
    return me;
  }
}
