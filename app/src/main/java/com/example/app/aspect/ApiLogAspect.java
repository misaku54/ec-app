package com.example.app.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    for (Object arg : joinPoint.getArgs()) {
      if (arg.getClass().getName().startsWith("com.example.app.form") ||
        (arg.getClass().getName().startsWith("com.example.app.dto"))) {

        try {
          ObjectMapper objectMapper = new ObjectMapper();
          String json = objectMapper.writeValueAsString(arg);
          MDC.put("api.req.body", arg.getClass().getSimpleName() + ":" + json);
        } catch (Exception e) {
          log.warn("リクエストボディのログ出力に失敗しました", e);
        }
      }
    }
    log.info("メソッド開始：" + joinPoint.getSignature());
  }

  @After("execution(public * com.example.app.rest..*.*(..))")
  public void after(JoinPoint joinPoint) {
    log.info("メソッド終了：" + joinPoint.getSignature());
    MDC.clear();
  }
}
