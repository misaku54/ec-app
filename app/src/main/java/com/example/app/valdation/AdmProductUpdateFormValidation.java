package com.example.app.valdation;

import com.example.app.form.AdmProductCreateForm;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class AdmProductUpdateFormValidation implements Validator {

  @Override
  public boolean supports(Class<?> clazz) {
    return AdmProductCreateForm.class.isAssignableFrom(clazz);
  }

  @Override
  public void validate(Object target, Errors errors) {
    AdmProductCreateForm form = (AdmProductCreateForm) target;
  }

}
