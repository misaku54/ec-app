package com.example.app.service.impl;

import com.example.app.dto.OrderDto;
import com.example.app.dto.OrderItemDto;
import com.example.app.dto.OrderResultDto;
import com.example.app.dto.ProductDto;
import com.example.app.exception.ApiInvalidUpdateException;
import com.example.app.exception.ApiNotFoundException;
import com.example.app.form.OrderCreateForm;
import com.example.app.form.OrderItemForm;
import com.example.app.mapper.OrderMapper;
import com.example.app.mapper.ProductMapper;
import com.example.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
  private final ProductMapper productMapper;
  private final OrderMapper orderMapper;

  @Override
  @Transactional
  public OrderResultDto createOrder(int accountId, OrderCreateForm form) {
    List<OrderItemDto> orderItems = buildOrderItems(form);
    int totalAmount = calcTotalAmount(orderItems);
    OrderDto order = insertOrder(accountId, form, totalAmount);
    orderMapper.insertOrderItems(order.getId(), orderItems);

    OrderResultDto orderResult = new OrderResultDto();
    orderResult.setOrderId(order.getId());
    orderResult.setStatus("PENDING");
    orderResult.setTotalAmount(totalAmount);
    return orderResult;
  }

  // 在庫チェック・減算・OrderItemDto組み立て
  private List<OrderItemDto> buildOrderItems(OrderCreateForm form) {
    List<OrderItemDto> orderItems = new ArrayList<>();

    for (OrderItemForm item: form.getItems()) {
      ProductDto product = productMapper.getProductByIdForUpdate(item.getProductId());

      if (product == null) {
        throw new ApiNotFoundException("商品が見つかりません。 id:" + item.getProductId());
      }
      if (product.getStock() < item.getQuantity()) {
        throw new ApiInvalidUpdateException(product.getName() + "が在庫不足です。");
      }
      productMapper.updateProductStock(item.getProductId(), item.getQuantity());

      OrderItemDto orderItem = new OrderItemDto();
      orderItem.setProductId(item.getProductId());
      orderItem.setProductName(product.getName()); // 注文時点の商品名（スナップショット）
      orderItem.setUnitPrice(product.getPrice());  // 注文時点の単価（スナップショット）
      orderItem.setQuantity(item.getQuantity());
      orderItems.add(orderItem);
    }

    return orderItems;
  }

  private int calcTotalAmount(List<OrderItemDto> orderItems) {
    return orderItems.stream()
          .filter(Objects::nonNull)
          .mapToInt(item -> item.getUnitPrice() * item.getQuantity())
          .sum();
  }

  private OrderDto insertOrder(int accountId, OrderCreateForm form, int totalAmount) {
    OrderDto order = new OrderDto();
    order.setAccountId(accountId);
    order.setTotalAmount(totalAmount);
    order.setShippingName(form.getShippingName());
    order.setShippingPostalCode(form.getShippingPostalCode());
    order.setShippingAddress(form.getShippingAddress());
    order.setShippingPhone(form.getShippingPhone());
    order.setNote(form.getNote());

    orderMapper.insertOrder(order);
    return order;
  }
}
