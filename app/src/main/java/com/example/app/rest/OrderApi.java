package com.example.app.rest;

import com.example.app.dto.OrderResultDto;
import com.example.app.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class OrderApi {
  public ResponseDto<OrderResultDto> createOrder() {

    ResponseDto<OrderResultDto> response = new ResponseDto<>();
    return response;
  }
}
