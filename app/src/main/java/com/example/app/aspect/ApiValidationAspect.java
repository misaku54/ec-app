package com.example.app.aspect;

import com.example.app.exception.ErrorMessageException;
import com.example.app.util.DtoUtils;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

import java.util.Locale;

@Aspect
@Component
@Slf4j
public class ApiValidationAspect {

  @Autowired
  private MessageSource messageSource;

  @Before(value="@annotation(com.example.app.annotation.UseBindingResult)")
  public void beforeUseBindingResult(JoinPoint joinPoint) {
    BindingResult bindingResult = null;
    Locale locale = null;
    Object[] args = joinPoint.getArgs();

    for(Object arg: args) {
      if (arg instanceof BindingResult) {
        bindingResult = (BindingResult) arg;
      } else if (arg instanceof Locale) {
        locale = (Locale) arg;
      }
      if (bindingResult != null && locale != null) {
        break;
      }
    }

    if (bindingResult.hasErrors()) {
      throw new ErrorMessageException(DtoUtils.toValidationErrorDto(bindingResult, this.messageSource, locale));
    }

  }
}
