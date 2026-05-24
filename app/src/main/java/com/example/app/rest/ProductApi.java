package com.example.app.rest;

import com.example.app.dto.PageInfoDto;
import com.example.app.dto.ProductDetailDto;
import com.example.app.dto.ResponseListDto;
import com.example.app.form.ProductSearchParam;
import com.example.app.service.ProductService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/product")
public class ProductApi {

  private final ProductService productService;

  @GetMapping("/list")
  public ResponseEntity<ResponseListDto<ProductDetailDto>> productList(
      ProductSearchParam param,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "20") int size) {
    PageHelper.startPage(page, size);

    List<ProductDetailDto> list = productService.searchProducts(param);

    PageInfo<ProductDetailDto> pageInfo = new PageInfo<>(list);

    ResponseListDto<ProductDetailDto> response = new ResponseListDto<>();
    response.setStatus("success");
    response.setData(list);
    response.setPageInfo(new PageInfoDto(pageInfo.getTotal(), pageInfo.getPages(), pageInfo.getPageNum(), pageInfo.getPageSize()));
    return ResponseEntity.ok(response);
  }
}
