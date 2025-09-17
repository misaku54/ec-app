package com.example.app.service;

import com.example.app.entity.Employee;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ExcelSampleService {
  public void excelOutSample() throws Exception {
    Date date = new Date();
    Employee employee = new Employee("name", date, 1, 2);
    Employee employee2 = new Employee("name", date, 1, 2);

    List<Employee> employeeList  = new ArrayList<>();
    employeeList.add(employee);
    employeeList.add(employee2);

    try (InputStream in = new FileInputStream(new File("exports/sample.xlsx"))) {
      try (OutputStream out = new FileOutputStream(new File("out.xlsx"))) {
        Context context = new Context();
        context.putVar("employees", employeeList);
        JxlsHelper.getInstance().processTemplate(in, out, context);
      }
    }
  }
}
