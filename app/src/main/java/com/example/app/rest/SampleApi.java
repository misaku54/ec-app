package com.example.app.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.IIOException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

@RestController
public class SampleApi {
  @GetMapping("/getUrlSample")
  public String getUrl() throws IOException {
    URL url = new URL("https://dokojava.jp");
    InputStream is = url.openStream();
    try (InputStreamReader isr = new InputStreamReader(is)) {
      int i = isr.read();

      while(i != -1) {
        System.out.print((char)i);
        i = isr.read();
      }
    }
    return "end";
  }
}
