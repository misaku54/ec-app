package com.example.app.rest;

import com.example.app.annotation.UseBindingResult;
import com.example.app.dto.AccountDto;
import com.example.app.dto.MeDto;
import com.example.app.dto.ResponseDto;
import com.example.app.form.AccountRegisterForm;
import com.example.app.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class AccountApi {

  private final AccountService accountService;

  @GetMapping("/me")
  public ResponseEntity<ResponseDto<MeDto>> getMe(@AuthenticationPrincipal UserDetails user) {
    String email = user.getUsername();

    AccountDto account = accountService.findByEmail(email);

    MeDto me = new MeDto();
    me.setId(account.getId());
    me.setEmail(account.getEmail());
    me.setRoles(account.getRoles());

    ResponseDto<MeDto> response = new ResponseDto<>();
    response.setStatus("success");
    response.setData(me);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping("/public/register")
  @UseBindingResult
  public ResponseEntity<ResponseDto<Void>> register(@Validated @RequestBody AccountRegisterForm accountRegisterForm, BindingResult bindingResult, Locale locale) {
    accountService.register(
      accountRegisterForm.getName(),
      accountRegisterForm.getEmail(),
      accountRegisterForm.getPassword()
    );

    ResponseDto<Void> response = new ResponseDto<>();
    response.setStatus("success");
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }
}
