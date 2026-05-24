package com.example.app.service;

import com.example.app.dto.OrderResultDto;
import com.example.app.form.OrderCreateForm;

public interface OrderService {
  OrderResultDto createOrder(int accountId, OrderCreateForm form);
}
