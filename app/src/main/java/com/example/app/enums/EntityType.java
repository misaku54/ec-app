package com.example.app.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EntityType implements IntEnum {

  PRODUCT(1, "商品"),
  USER(2, "ユーザー");

  private final int value;

  private final String display;

  EntityType(int value, String display) {
    this.value = value;
    this.display = display;
  }

  // 値からEnumを取得するメソッド（デシリアライズ）
  @JsonCreator
  public static EntityType of(int value) {
    for (var instance : EntityType.values()) {
      if (instance.value == value) {
        return instance;
      }
    }
    throw new IllegalArgumentException();
  }

// jsonValueがあると、entityTypeをJsonに変換した時に
//  {
//    "entityType": 1
//  }　という形でvalueが値として扱われる
  @Override
  @JsonValue
  public int getValue() {
    return value;
  }

  @Override
  public String getDisplay() {
    return display;
  }
}
