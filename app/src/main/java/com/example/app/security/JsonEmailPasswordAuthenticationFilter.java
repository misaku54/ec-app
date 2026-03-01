package com.example.app.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class JsonEmailPasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

  ObjectMapper objectMapper = new ObjectMapper();

  @Getter
  @Setter
  String emailParameter = "email";
  @Getter
  @Setter
  String passwordParameter = "password";

  protected AuthenticationDetailsSource<HttpServletRequest, ?> authenticationDetailsSource = new WebAuthenticationDetailsSource();

  public JsonEmailPasswordAuthenticationFilter(AuthenticationManager authenticationManager) {
    // 「POST /login」へのリクエストだけ処理する
    super(PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.POST, "/login"));
    // コンストラクタにAbstractAuthenticationProcessingFilterのセッターメソッドを介してログイン成功、失敗時の処理、ログイン成功時の認証情報の保存先などを設定できる
    this.setAuthenticationManager(authenticationManager);
    this.setSecurityContextRepository(new HttpSessionSecurityContextRepository());
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
    Map<String, Object> requestObject;

    try {
      // JSON ボディ全体を Map として読み込む
      requestObject = objectMapper.readValue(request.getInputStream(), Map.class);
    } catch (IOException e) {
      requestObject = new HashMap<>();
    }

    String email =
      Optional.ofNullable(requestObject.get(this.emailParameter))
        .map(Object::toString)
        .map(String::trim)
        .orElse("");

    String password =
      Optional.ofNullable(requestObject.get(this.passwordParameter))
        .map(Object::toString)
        .map(String::trim)
        .orElse("");

    // 未認証トークンを作成して AuthenticationManager に渡す
    // → ここで AccountUserDetailsService が呼ばれる
    UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(email, password);
    authRequest.setDetails(authenticationDetailsSource.buildDetails(request));

    return this.getAuthenticationManager().authenticate(authRequest);
  }

}
