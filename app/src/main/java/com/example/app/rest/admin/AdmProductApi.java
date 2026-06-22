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
import java.util.Locale;

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
  public ResponseDto<ProductDetailDto> detailProduct(@PathVariable("productId") int productId) throws Exception {
    ProductDetailDto productDetail = productService.getProductDetail(productId);
    return ResponseDto.success(productDetail);
  }

  @PostMapping("/create")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseDto<ProductDetailDto> createProduct(@ModelAttribute @Validated AdmProductCreateForm admProductCreateForm, BindingResult br, Locale locale) throws Exception {
    ProductDto product = new ProductDto();
    product.setName(admProductCreateForm.getName());
    product.setDescription(admProductCreateForm.getDescription());
    product.setPrice(admProductCreateForm.getPrice());
    product.setStock(admProductCreateForm.getStock());

    ProductDetailDto createdProductDetail = productService.createProduct(product, admProductCreateForm.getImageFiles());
    return ResponseDto.success(createdProductDetail);
  }

  // TODO:時間があれば修正
  @PostMapping("/update")
  public ResponseDto<Void> updateProduct(@ModelAttribute AdmProductUpdateForm admProductUpdateForm) throws Exception {
    ProductDto product = new ProductDto();
    product.setId(admProductUpdateForm.getId());
    product.setName(admProductUpdateForm.getName());
    product.setDescription(admProductUpdateForm.getDescription());
    product.setPrice(admProductUpdateForm.getPrice());
    product.setStock(admProductUpdateForm.getStock());

    productService.updateProduct(product, admProductUpdateForm.getUpdateImages());
    return ResponseDto.success();
  }

  @PostMapping("/delete")
  public ResponseDto<ProductDeleteDto> deleteProduct(@RequestBody AdmProductDeleteForm admProductDeleteForm) throws Exception {
    ProductDeleteDto productDelete = productService.deleteProduct(admProductDeleteForm.getId());
    return ResponseDto.success(productDelete);
  }

}
