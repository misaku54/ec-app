package com.example.app.mapper;

import com.example.app.dto.AddressDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AddressMapper {
  int insertAddresses(@Param("addresses") List<AddressDto> addressList,
                      @Param("accountId") Integer accountId);
}
