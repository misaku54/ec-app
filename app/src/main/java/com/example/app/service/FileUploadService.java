package com.example.app.service;

import com.example.app.enums.EntityType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {

  String generateOjbectKey(EntityType entityType, Integer id, int sortOrder) throws Exception;

  void uploadImage(String objectKey, MultipartFile imageFile) throws Exception;

  String getImageUrl(String objectKey);
}
