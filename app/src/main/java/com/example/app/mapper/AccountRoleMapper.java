package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AccountRoleMapper {
  int insertAccountRole(@Param("accountId") Integer accountId,
                        @Param("roleId") Integer roleId);
}
