package com.example.app.mapper;

import com.example.app.dto.OrderDto;
import com.example.app.dto.OrderHistoryItemDto;
import com.example.app.dto.OrderItemDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
  List<OrderHistoryItemDto> getOrderList(@Param("accountId") int accountId);
  int insertOrder(OrderDto order);
  int insertOrderItems(@Param("orderId") int orderId, @Param("orderItems") List<OrderItemDto> orderItems);
}
