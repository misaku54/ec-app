package com.example.app.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class AdmProductBaseForm {

  @NotBlank(message="{require}")
  private String name;
  @NotBlank(message="{require}")
  private String description;

  private int price;

  private int stock;

  private List<MultipartFile> imageFiles;

}
