package com.example.app.rest.admin;

import com.example.app.dto.*;
import com.example.app.form.AdmProductCreateForm;
import com.example.app.form.AdmProductDeleteForm;
import com.example.app.form.AdmProductUpdateForm;
import com.example.app.form.ProductSearchParam;
import com.example.app.service.ProductService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/product")
public class AdmProductApi {

  private final ProductService productService;

  @GetMapping("/list")
  public ResponseEntity<ResponseListDto<ProductDto>> productList(
      ProductSearchParam param,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "20") int size) {
    PageHelper.startPage(page, size);

    List<ProductDto> list = productService.getProductList(param);
    PageInfo<ProductDto> pageInfo = new PageInfo<>(list);

    ResponseListDto<ProductDto> response = new ResponseListDto<>();
    response.setStatus("success");
    response.setData(list);
    response.setPageInfo(new PageInfoDto(pageInfo.getTotal(), pageInfo.getPages(), pageInfo.getPageNum(), pageInfo.getPageSize()));
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @GetMapping("/{productId}")
  public ResponseEntity<ResponseDto<ProductDetailDto>> detailProduct(@PathVariable("productId") int productId) throws Exception {
    ProductDetailDto productDetailDto = productService.getProductDetail(productId);

    ResponseDto<ProductDetailDto> response = new ResponseDto<>();
    response.setStatus("success");
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
    response.setStatus("success");
    response.setData(createdProductDetail);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  // TODO:あとで修正
  @PostMapping("/update")
  public ResponseEntity<ResponseDto<Void>> updateProduct(@ModelAttribute AdmProductUpdateForm admProductUpdateForm) throws Exception {
    ProductDto product = new ProductDto();
    product.setId(admProductUpdateForm.getId());
    product.setName(admProductUpdateForm.getName());
    product.setDescription(admProductUpdateForm.getDescription());
    product.setPrice(admProductUpdateForm.getPrice());
    product.setStock(admProductUpdateForm.getStock());

    productService.updateProduct(product, admProductUpdateForm.getUpdateImages());

    ResponseDto<Void> response = new ResponseDto<>();
    response.setStatus("success");
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping("/delete")
  public ResponseEntity<ResponseDto<ProductDeleteDto>> deleteProduct(@RequestBody AdmProductDeleteForm admProductDeleteForm) throws Exception {
    ProductDeleteDto dto = productService.deleteProduct(admProductDeleteForm.getId());

    ResponseDto<ProductDeleteDto> response = new ResponseDto<>();
    response.setStatus("success");
    response.setData(dto);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

}
