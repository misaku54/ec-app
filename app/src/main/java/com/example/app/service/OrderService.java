package com.example.app.service;

import com.example.app.dto.OrderHistoryItemDto;
import com.example.app.dto.OrderResultDto;
import com.example.app.form.OrderCreateForm;

import java.util.List;

public interface OrderService {
  List<OrderHistoryItemDto> getOrderList(int accountId);
  OrderResultDto createOrder(int accountId, OrderCreateForm form);
}
