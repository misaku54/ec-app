package com.example.app.mapper;

import com.example.app.dto.OrderDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper {
  int insertOrder(OrderDto order);
}
