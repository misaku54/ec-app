package com.example.app.service.impl;

import com.example.app.dto.OrderDto;
import com.example.app.dto.OrderItemDto;
import com.example.app.dto.OrderResultDto;
import com.example.app.dto.ProductDetailDto;
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

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
  private final ProductMapper productMapper;
  private final OrderMapper orderMapper;

  @Override
  @Transactional
  public OrderResultDto createOrder(int accountId, OrderCreateForm form) {
    List<OrderItemDto> orderItems = new ArrayList<>();
    int totalAmount = 0;

    for (OrderItemForm item : form.getItems()) {
      // 商品データ抽出＆ロック
      ProductDetailDto product = productMapper.getProductByIdForUpdate(item.getProductId());

      // 商品の存在チェック
      if (product == null) {
        throw new ApiNotFoundException("商品が見つかりません。 id:" + item.getProductId());
      }
      // 商品の在庫チェック
      if (product.getStock() < item.getQuantity()) {
        throw new ApiInvalidUpdateException(product.getName() + "が在庫不足です。");
      }
      // 在庫更新
      productMapper.updateProductStock(item.getProductId(), item.getQuantity());

      // 注文明細インサート用
      OrderItemDto orderItem = new OrderItemDto();
      orderItem.setProductId(item.getProductId());
      orderItem.setProductName(product.getName()); // 注文時点の商品名（スナップショット）
      orderItem.setUnitPrice(product.getPrice());  // 注文時点の単価（スナップショット）
      orderItem.setQuantity(item.getQuantity());
      orderItems.add(orderItem);

      // 合計金額算出
      totalAmount += product.getPrice() * item.getQuantity();
    }

    // 全商品のチェック後、注文データを登録
    OrderDto order = new OrderDto();
    order.setAccountId(accountId);
    order.setTotalAmount(totalAmount);
    order.setShippingName(form.getShippingName());
    order.setShippingPostalCode(form.getShippingPostalCode());
    order.setShippingAddress(form.getShippingAddress());
    order.setShippingPhone(form.getShippingPhone());
    order.setNote(form.getNote());
    orderMapper.insertOrder(order);
    orderMapper.insertOrderItems(order.getId(), orderItems);

    // 注文結果
    OrderResultDto orderResult = new OrderResultDto();
    orderResult.setOrderId(order.getId());
    orderResult.setStatus("PENDING");
    orderResult.setTotalAmount(totalAmount);
    return orderResult;
  }
}
