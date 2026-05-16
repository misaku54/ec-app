package com.example.app.mapper;

import com.example.app.dto.RoleDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface RoleMapper {
  Optional<RoleDto> findByName(@Param("name") String name);
}
