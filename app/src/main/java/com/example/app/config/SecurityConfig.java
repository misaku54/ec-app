package com.example.app.config;

import com.example.app.security.JsonEmailPasswordAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  // パスワードエンコーダ
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // securityFilterChainで必要になるため、authenticationManagerをBean登録しておく
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
    JsonEmailPasswordAuthenticationFilter jsonEmailPasswordAuthenticationFilter =
      new JsonEmailPasswordAuthenticationFilter(authenticationManager);

    /*
     * setAuthenticationSuccessHandler：ログイン成功時の処理を設定
     * setAuthenticationSuccessHandlerの引数はAuthenticationSuccessHandler型。
     * AuthenticationSuccessHandlerは抽象メソッドを一つだけ持つ関数型インターフェースである。
     * そのため、１インターフェースの実装、２抽象メソッドのオーバーライド、３実装クラスのインスタンス生成
     * といった３つの流れをラムダ式で１本で書くことができる。
     */
    jsonEmailPasswordAuthenticationFilter.setAuthenticationSuccessHandler((req, res, auth) -> {
      res.setStatus(HttpStatus.OK.value());
      res.setContentType("application/json;charset=UTF-8");
      res.getWriter().write("{\"message\":\"login success\"}");
    });
    jsonEmailPasswordAuthenticationFilter.setAuthenticationFailureHandler((req, res, auth) -> {
      res.setStatus(HttpStatus.FORBIDDEN.value());
      res.setContentType("application/json;charset=UTF-8");
      res.getWriter().write("{\"message\":\"login failed\"}");
    });

    // filter
    // authenticationEntryPointは未認証（ログインしていない）ユーザーがアクセスしたとき 401
    // accessDeniedHandlerは認証済みだが権限が足りないユーザーがアクセスしたとき　403
    http
      .csrf(AbstractHttpConfigurer::disable)
      .exceptionHandling(ex -> ex
        .authenticationEntryPoint((req, res, auth) -> {
          res.setStatus(HttpStatus.UNAUTHORIZED.value());
          res.setContentType("application/json;charset=UTF-8");
          res.getWriter().write("{\"message\":\"unauthorized\"}");
        })
        .accessDeniedHandler((req, res, auth) -> {
          res.setStatus(HttpStatus.FORBIDDEN.value());
          res.setContentType("application/json;charset=UTF-8");
          res.getWriter().write("{\"message\":\"forbidden\"}");
        })
      )
      // 認可ルール
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/login").permitAll()           // ログインは誰でもOK
        .requestMatchers("/api/admin/**").hasRole("ADMIN")              // 管理者のみ
        .requestMatchers("/api/customer/**").hasAnyRole("USER", "ADMIN") // 顧客・管理者
        .anyRequest().authenticated() // マッチャー以外のすべてのリクエストは 認証済みであること を要求
      )

      // JSONログインフィルターを差し込む
      // addFilterAtは指定したフィルタークラスの場所にフィルターを追加するメソッド。
      // ここではUsernamePasswordAuthenticationFilterの場所にカスタムフィルターを配置するという意味で
      // つまり、デフォルトのフォーム認証フィルターを置き換えるという意味になる
      .addFilterAt(jsonEmailPasswordAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    // sessionManegermentはデフォルト設定でよければ、記載はいらない。

    return http.build();
  }

}
