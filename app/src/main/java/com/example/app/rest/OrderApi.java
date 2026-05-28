package com.example.app.rest;

import com.example.app.annotation.UseBindingResult;
import com.example.app.dto.OrderResultDto;
import com.example.app.dto.ResponseDto;
import com.example.app.form.OrderCreateForm;
import com.example.app.service.OrderService;
import com.example.app.util.CurrentUserSupport;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer/order")
public class OrderApi {
  private final OrderService orderService;

  @PostMapping("/create")
  @UseBindingResult
  public ResponseDto<OrderResultDto> createOrder(@Validated @RequestBody OrderCreateForm form, BindingResult br, Locale locale) {
    OrderResultDto orderResult = orderService.createOrder(CurrentUserSupport.getAccountId(), form);

    ResponseDto<OrderResultDto> response = new ResponseDto<>();
    response.setStatus("success");
    response.setData(orderResult);
    return response;
  }
}
