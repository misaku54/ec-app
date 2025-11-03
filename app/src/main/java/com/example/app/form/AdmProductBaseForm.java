package com.example.app.form;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AdmProductBaseForm {

  private String name;

  private String description;

  private int price;

  private int stock;

  private MultipartFile imageFile;

}
