package com.example.app.rest.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class ProductController {

  @GetMapping("/list")
  public String productList() {
    return "dummy";
  }
}
