// ...existing code...
package com.example.app.mapper;

import com.example.app.dto.S3FileDto;
import com.example.app.enums.EntityType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface S3FileMapper {

  S3FileDto getS3FileById(@Param("id") int id);

  List<String> getS3FileKeyByEntityTypeAndId(
    @Param("entityType") EntityType entityType,
    @Param("entityId") int entityId);

  /**
   * S3_FILES テーブルにレコードを挿入し、生成された ID を S3FileDto.id に設定する
   * @param s3File 挿入対象の DTO（entityType は Enum なので SQL 内で value を参照します）
   * @return 件数（1 が期待される）
   */
  int insertS3File(S3FileDto s3File);

  int deleteS3FileById(@Param("id") int id);

  int updateS3FileOrderAndMainImageById(
    @Param("id") int id,
    @Param("sortOrder") int sortOrder,
    @Param("isMainImage") boolean isMainImage);

  int deleteS3FileByEntityTypeAndId(
    @Param("entityType") EntityType entityType,
    @Param("entityId") int entityId);

  int getMaxSortOrderByEntityTypeAndId(
    @Param("entityType") EntityType entityType,
    @Param("entityId") int entityId);

}

