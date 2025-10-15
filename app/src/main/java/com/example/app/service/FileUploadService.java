package com.example.app.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {
  String uploadImage(String prefix, int id, MultipartFile imageFile) throws IOException;
}
