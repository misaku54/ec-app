package com.example.app.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.jboss.logging.MDC;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ApiLogAspect {
  @Before("execution(public * com.example.app.rest..*.*(..))")
  public void before(JoinPoint joinPoint) {
    MDC.put("ControllerClassName", joinPoint.getSignature().getDeclaringTypeName());
    MDC.put("ControllerMethodName", joinPoint.getSignature().getName());
    log.info("メソッド開始：" + joinPoint.getSignature());
  }

  @After("execution(public * com.example.app.rest..*.*(..))")
  public void after(JoinPoint joinPoint) {
    log.info("メソッド終了：" + joinPoint.getSignature());
  }
}
