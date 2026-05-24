package com.example.app.util;

import com.example.app.security.CustomUserDetails;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentUserSupport {

  public static CustomUserDetails getLoginUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
      return (CustomUserDetails) authentication.getPrincipal();
    }
    return null;
  }

  public static int getAccountId() {
    CustomUserDetails user = getLoginUser();
    if (user == null) {
      throw new IllegalStateException("No authenticated user in SecurityContext");
    }
    return user.getAccount().getId();
  }
}
