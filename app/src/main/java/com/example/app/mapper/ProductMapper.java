package com.example.app.mapper;

import com.example.app.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductMapper {

  List<ProductDto> getProductList();
}
