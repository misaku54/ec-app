package com.example.app.rest.admin;

import com.example.app.dto.ProductDto;
import com.example.app.dto.ResponseListDto;
import com.example.app.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class AdmProductApi {

  private final ProductService productService;

  @GetMapping("/list")
  public ResponseListDto<ProductDto> productList() {
    List<ProductDto> productDtoList = productService.getProductList();

    ResponseListDto<ProductDto> response = new ResponseListDto<>();
    response.setData(productDtoList);
    return response;
  }
}
