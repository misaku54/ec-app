package com.example.app.enums.converters;

import com.example.app.enums.EntityType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EntityTypeConverter implements AttributeConverter<EntityType, Integer> {

  @Override
  public Integer convertToDatabaseColumn(EntityType entityType) {
    return entityType != null ? entityType.getValue() : null;
  }

  @Override
  public EntityType convertToEntityAttribute(Integer value) {
    return value != null ? EntityType.of(value) : null;
  }

}
