package com.example.app.form;

import com.example.app.dto.ImageUpdateDto;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class AdmProductUpdateForm extends AdmProductBaseForm  {

  private int id;

  private List<ImageUpdateDto> existingImages;

}
