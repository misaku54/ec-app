package com.example.app.mapper;

import com.example.app.dto.ProductDetailDto;
import com.example.app.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {

  List<ProductDto> getProductList();

  ProductDetailDto getProductDetailById(@Param("productId") int productId);

  int createProduct(ProductDto product);

  int updateProduct(ProductDto product);

  int deleteProduct(@Param("productId") int productId);

}
