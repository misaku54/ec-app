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
  public ResponseDto<String> doCreateProduct(@ModelAttribute AdmProductCreateForm admProductCreateForm) throws Exception {
    ProductDto product = new ProductDto();
    product.setName(admProductCreateForm.getName());
    product.setDescription(admProductCreateForm.getDescription());
    product.setPrice(admProductCreateForm.getPrice());
    product.setStock(admProductCreateForm.getStock());

    productService.createProduct(product, admProductCreateForm.getImageFile());

    ResponseDto<String> response = new ResponseDto<>();
    response.setData("success");
    return response;
  }
}
