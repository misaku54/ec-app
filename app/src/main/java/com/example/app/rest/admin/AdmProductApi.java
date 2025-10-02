package com.example.app.rest.admin;

import com.example.app.dto.ProductDto;
import com.example.app.dto.ResponseDto;
import com.example.app.dto.ResponseListDto;
import com.example.app.form.AdmProductCreateForm;
import com.example.app.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin/product")
public class AdmProductApi {

  private final ProductService productService;

  @GetMapping("/list")
  public ResponseListDto<ProductDto> productList() {
    List<ProductDto> productDtoList = productService.getProductList();

    ResponseListDto<ProductDto> response = new ResponseListDto<>();
    response.setData(productDtoList);
    return response;
  }

  @PostMapping("/create")
  public ResponseDto<String> doCreateProduct(@RequestBody AdmProductCreateForm admProductCreateForm) {
    ResponseDto<String> response = new ResponseDto<>();
    response.setData("success");
    return response;
  }
}
