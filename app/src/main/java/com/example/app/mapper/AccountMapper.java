package com.example.app.mapper;

import com.example.app.dto.AccountDto;
import com.example.app.dto.ProductDetailDto;
import com.example.app.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface AccountMapper {

  Optional<AccountDto> findByEmail(@Param("email") String email);

}
