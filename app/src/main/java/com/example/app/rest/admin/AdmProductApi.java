package com.example.app.rest.admin;

import com.example.app.dto.ProductDetailDto;
import com.example.app.dto.ProductDto;
import com.example.app.dto.ResponseDto;
import com.example.app.dto.ResponseListDto;
import com.example.app.form.AdmProductCreateForm;
import com.example.app.form.AdmProductDeleteForm;
import com.example.app.form.AdmProductUpdateForm;
import com.example.app.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
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

  @GetMapping("/{productId}")
  public ResponseEntity<ResponseDto<ProductDetailDto>> detailProduct(@PathVariable("productId") int productId) throws Exception {
    ProductDetailDto productDetailDto = productService.getProductDetail(productId);

    ResponseDto<ProductDetailDto> response = new ResponseDto<>();
    response.setMessage("success");
    response.setData(productDetailDto);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping("/create")
  public ResponseEntity<ResponseDto<ProductDetailDto>> createProduct(@ModelAttribute @Validated AdmProductCreateForm admProductCreateForm, BindingResult br) throws Exception {
    ProductDto product = new ProductDto();
    product.setName(admProductCreateForm.getName());
    product.setDescription(admProductCreateForm.getDescription());
    product.setPrice(admProductCreateForm.getPrice());
    product.setStock(admProductCreateForm.getStock());

    ProductDetailDto createdProductDetail = productService.createProduct(product, admProductCreateForm.getImageFiles());

    ResponseDto<ProductDetailDto> response = new ResponseDto<>();
    response.setMessage("success");
    response.setData(createdProductDetail);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }
  // TODO:あとで修正
  @PostMapping("/update")
  public ResponseDto<String> updateProduct(@ModelAttribute AdmProductUpdateForm admProductUpdateForm) throws Exception {
    ProductDto product = new ProductDto();
    product.setId(admProductUpdateForm.getId());
    product.setName(admProductUpdateForm.getName());
    product.setDescription(admProductUpdateForm.getDescription());
    product.setPrice(admProductUpdateForm.getPrice());
    product.setStock(admProductUpdateForm.getStock());


    productService.updateProduct(product, admProductUpdateForm.getUpdateImages());

    ResponseDto<String> response = new ResponseDto<>();
    response.setData("success");
    return response;
  }

  @PostMapping("delete")
  public ResponseDto<String> deleteProduct(@RequestBody AdmProductDeleteForm admProductDeleteForm) throws Exception {
    productService.deleteProduct(admProductDeleteForm.getId());

    ResponseDto<String> response = new ResponseDto<>();
    response.setData("success");
    return response;
  }

}
