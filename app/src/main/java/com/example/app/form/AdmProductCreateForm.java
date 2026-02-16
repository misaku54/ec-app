package com.example.app.form;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class AdmProductCreateForm extends AdmProductBaseForm {
  private List<MultipartFile> imageFiles;
}
