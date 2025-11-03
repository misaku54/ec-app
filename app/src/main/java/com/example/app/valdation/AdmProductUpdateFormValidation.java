package com.example.app.valdation;

import com.example.app.form.AdmProductUpdateForm;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class AdmProductUpdateFormValidation implements Validator {

  @Override
  public boolean supports(Class<?> clazz) {
    return AdmProductUpdateForm.class.isAssignableFrom(clazz);
  }

  @Override
  public void validate(Object target, Errors errors) {
    AdmProductUpdateForm form = (AdmProductUpdateForm) target;
  }

}
