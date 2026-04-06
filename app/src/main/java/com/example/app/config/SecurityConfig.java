package com.example.app.config;

import com.example.app.dto.LoginSuccessDto;
import com.example.app.security.JsonEmailPasswordAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  // パスワードエンコーダ
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // securityFilterChainで必要になるため、authenticationManagerをBean登録しておく。本来は設定不要である。
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  UrlBasedCorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3003"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
    JsonEmailPasswordAuthenticationFilter jsonEmailPasswordAuthenticationFilter =
      new JsonEmailPasswordAuthenticationFilter(authenticationManager);

    ObjectMapper objectMapper = new ObjectMapper();

    /*
     * setAuthenticationSuccessHandler：ログイン成功時の処理を設定
     * setAuthenticationSuccessHandlerの引数はAuthenticationSuccessHandler型。
     * AuthenticationSuccessHandlerは抽象メソッドを一つだけ持つ関数型インターフェースである。
     * そのため、１インターフェースの実装、２抽象メソッドのオーバーライド、３実装クラスのインスタンス生成
     * といった３つの流れをラムダ式で１本で書くことができる。
     */
    jsonEmailPasswordAuthenticationFilter.setAuthenticationSuccessHandler((req, res, auth) -> {
      LoginSuccessDto dto = new LoginSuccessDto();
      dto.setMessage("success");
      dto.setAuthenticated(true);
      dto.setRoles(auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());

      res.setStatus(HttpStatus.OK.value());
      res.setContentType("application/json;charset=UTF-8");
      res.getWriter().write(objectMapper.writeValueAsString(dto));
    });

    /*
     * setAuthenticationSuccessHandler：ログイン失敗時の処理を設定
     */
    jsonEmailPasswordAuthenticationFilter.setAuthenticationFailureHandler((req, res, auth) -> {
      res.setStatus(HttpStatus.FORBIDDEN.value());
      res.setContentType("application/json;charset=UTF-8");
      res.getWriter().write("{\"message\":\"login failed\"}");
    });

    // filter
    // authenticationEntryPointは未認証（ログインしていない）ユーザーがアクセスしたとき 401
    // accessDeniedHandlerは認証済みだが権限が足りないユーザーがアクセスしたとき　403
    http
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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
      .addFilterAt(jsonEmailPasswordAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

      // ログアウト設定
      // POST /logout でセッションを無効化し、Cookieを削除する
      .logout(logout -> logout
        .logoutUrl("/logout")                   // ログアウトエンドポイント（POST /logout）
        .invalidateHttpSession(true)            // サーバー側のセッションを破棄
        .deleteCookies("JSESSIONID")            // クライアントのCookieを削除
        .logoutSuccessHandler((req, res, auth) -> {
          res.setStatus(HttpStatus.OK.value());
          res.setContentType("application/json;charset=UTF-8");
          res.getWriter().write("{\"message\":\"logout success\"}");
        })
      );

    // sessionManegermentはデフォルト設定でよければ、記載はいらない。

    return http.build();
  }

}
