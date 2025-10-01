package com.example.app.rest;

import com.example.app.dto.SampleDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.IIOException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;

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

  @GetMapping("/webApi")
  public SampleDto getWebApi() throws Exception {
    HttpClient client = HttpClient.newBuilder()
      .version(HttpClient.Version.HTTP_1_1)
      .followRedirects(HttpClient.Redirect.NORMAL)
      .build();

    HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create("http://example.com/movies"))
      .GET()
      .build();

    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    String body = response.body();
    int status = response.statusCode();
    return new SampleDto(body,status);

  }
}
