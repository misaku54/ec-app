package com.example.app.dto;

import lombok.Data;

@Data
public class ImageUpdateDto {

  private int id;

  private String s3Key;

  private String action;

  private int sortOrder;

  private boolean isMainImage;

  private boolean delFlg;

  // アクション種別の定数
  public static final String ACTION_KEEP = "keep";
  public static final String ACTION_DELETE = "delete";
  public static final String ACTION_ADD = "add";

  // アクション判定用ヘルパーメソッド
  public boolean isKeep() {
    return ACTION_KEEP.equals(action);
  }

  public boolean isDelete() {
    return ACTION_DELETE.equals(action);
  }

  public boolean isAdd() {
    return ACTION_ADD.equals(action);
  }

}
