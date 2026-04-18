// [削除理由]
// Spring Security を導入したことにより、全リクエストは Spring MVC (DispatcherServlet) に到達する前に
// SecurityFilterChain で処理される。
// そのため、WebMvcConfigurer.addCorsMappings() によるCORS設定はリクエストに適用されなくなった。
// CORS設定は SecurityConfig.corsConfigurationSource() に一元化したため、このクラスは不要。

// package com.example.app.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


// @Configuration
// public class WebConfiguration implements WebMvcConfigurer {

//   @Override
//   public void addCorsMappings(CorsRegistry registry) {
//     registry.addMapping("/api/**")
//       .allowedOrigins("http://localhost:3003")
//       .allowedMethods("GET", "POST", "PUT", "DELETE")
//       .allowedHeaders("*")
//       .allowCredentials(true);
//   }
// }
