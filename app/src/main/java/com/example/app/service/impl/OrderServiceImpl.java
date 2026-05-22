package com.example.app.service.impl;

import com.example.app.dto.OrderResultDto;
import com.example.app.dto.ProductDetailDto;
import com.example.app.exception.ApiInvalidUpdateException;
import com.example.app.exception.ApiNotFoundException;
import com.example.app.form.OrderCreateForm;
import com.example.app.form.OrderItemForm;
import com.example.app.mapper.ProductMapper;
import com.example.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
  private final ProductMapper productMapper;

  @Override
  @Transactional
  public OrderResultDto createOrder(int accountId, OrderCreateForm form) {
    for (OrderItemForm item : form.getItems()) {

      ProductDetailDto product = productMapper.getProductByIdForUpdate(item.getProductId());

      // 商品の存在チェック
      if (Objects.isNull(product)) {
        throw new ApiNotFoundException("商品が見つかりません。 id:" + item.getProductId());
      }
      // 商品の在庫チェック
      if (product.getStock() < item.getQuantity()) {
        throw new ApiInvalidUpdateException(product.getName() + "が在庫不足です。");
      }
      // 注文


    }
    return new OrderResultDto();
  }
}
