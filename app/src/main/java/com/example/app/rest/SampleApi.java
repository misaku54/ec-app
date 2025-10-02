package com.example.app.rest;

import com.example.app.dto.SampleDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.IIOException;
import java.io.*;
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

  @PostMapping("/writeFile")
  public void writeFile() throws IOException {
    FileWriter fw = new FileWriter("sample.txt", true);
    fw.write("A");
    fw.flush();
    fw.close();
  }

  @PostMapping("/readFile")
  public void readFile() throws IOException {
    FileReader fr = new FileReader("sample2.txt");
    int i = fr.read();

    while(i != -1) {
      char c = (char)i;
      System.out.print(c);
      i = fr.read();
    }

    fr.close();
  }

  @GetMapping("/byte")
  public void byteWrite() {
    ByteArrayOutputStream bos = new ByteArrayOutputStream();

    bos.write(65);
    bos.write(66);
    byte[] data = bos.toByteArray();

    for (byte b : data) {
      System.out.println(b);
    }
  }

  // バイナリファイルにバイト列を書き込むための処理
  @GetMapping("write")
  public void writeByte() throws IOException {
    FileOutputStream fos = new FileOutputStream("data.dat", true);
    // 65は２進数で0100001 = Aという文字列
    // 実際はAという文字列を
    fos.write(65);// 引数はint
    fos.flush();
    fos.close();
  }
}
