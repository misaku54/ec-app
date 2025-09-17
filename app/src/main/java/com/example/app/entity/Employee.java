package com.example.app.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jxls.util.CellRefUtil;
import org.jxls.util.JxlsHelper;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
  private String name;
  private Date birthDate;
  private int payment;
  private int bonus;
}