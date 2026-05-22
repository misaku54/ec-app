package com.example.app.form;

import lombok.Data;

import java.util.List;

@Data
public class OrderCreateForm {
  private String shippingName;
  private String shippingPostalCode;
  private String shippingAddress;
  private String shippingPhone;
  private String note;
  private List<OrderItemForm> items;
}
