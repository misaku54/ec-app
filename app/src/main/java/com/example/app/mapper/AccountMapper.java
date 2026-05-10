package com.example.app.mapper;

import com.example.app.dto.AccountDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface AccountMapper {

  Optional<AccountDto> findByEmail(@Param("email") String email);

  int insertAccount(AccountDto account);
}
