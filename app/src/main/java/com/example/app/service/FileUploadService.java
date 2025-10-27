package com.example.app.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {

  String uploadImage(String prefix, Integer id, MultipartFile imageFile) throws Exception;

  String getImageUrl(String objectKey);
}
