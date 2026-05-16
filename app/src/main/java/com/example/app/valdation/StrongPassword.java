package com.example.app.valdation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StrongPasswordValidator.class)
public @interface StrongPassword {
  String message() default "パスワードは8文字以上で、英大文字・英小文字・数字をそれぞれ1文字以上含めてください";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}
