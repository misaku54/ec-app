package com.example.app.rest;

import com.example.app.annotation.UseBindingResult;
import com.example.app.dto.*;
import com.example.app.form.OrderCreateForm;
import com.example.app.service.OrderService;
import com.example.app.util.CurrentUserSupport;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer/order")
public class OrderApi {
  private final OrderService orderService;

  @GetMapping("/list")
  public ResponseListDto<OrderHistoryItemDto> orderList(
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "20") int size) {
    PageHelper.startPage(page, size);

    List<OrderHistoryItemDto> list = orderService.getOrderList(CurrentUserSupport.getAccountId());

    PageInfo<OrderHistoryItemDto> pageInfo = new PageInfo<>(list);

    ResponseListDto<OrderHistoryItemDto> response = new ResponseListDto<>();
    response.setStatus("success");
    response.setData(list);
    response.setPageInfo(new PageInfoDto(pageInfo.getTotal(), pageInfo.getPages(), pageInfo.getPageNum(), pageInfo.getPageSize()));
    return response;
  }

  @GetMapping("/{orderId}")
  public ResponseDto<OrderDetailDto> orderDetail(@PathVariable("orderId") int orderId) {
    OrderDetailDto orderDetail = orderService.getOrderDetail(orderId, CurrentUserSupport.getAccountId());

    ResponseDto<OrderDetailDto> response = new ResponseDto<>();
    response.setStatus("success");
    response.setData(orderDetail);
    return response;
  }

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
