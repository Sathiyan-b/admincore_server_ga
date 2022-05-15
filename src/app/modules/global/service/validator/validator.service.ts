import { Injectable } from "@angular/core";
import { ValidatorFn, FormControl } from "@angular/forms";
import {
  AsYouTypeFormatter,
  PhoneNumber,
  PhoneNumberFormat,
  PhoneNumberType,
  PhoneNumberUtil,
  StringBuffer,
} from "google-libphonenumber";
@Injectable({
  providedIn: "root",
})
export class ValidatorService {
  constructor() {}
  formEmail: ValidatorFn = (c: FormControl) => {
    // any component logic here
    if (!this.email(c.value)) {
      return { ["email"]: true };
    }
  };

  formValidatePhoneNumber = (c: FormControl) => {
    if (c.value == null || c.value.trim().length == 0) {
      return { ["invalid_phone_number"]: true };
    }
    if (
      !/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
        c.value.trim()
      )
    ) {
      return { invalid_phone_number: true };
    }
    var phone_util = PhoneNumberUtil.getInstance();
    if(c.root.get("country_code").value.code != null) {
      var phone_number = phone_util.parseAndKeepRawInput(
        c.value,
        c.root.get("country_code").value.code
      );
      if (!phone_util.isValidNumber(phone_number)) {
        return { ["invalid_phone_number"]: true };
      }
    }
   
  };

  formPassword: ValidatorFn = (c: FormControl) => {
    // any component logic here
    var password = c.value;
    var confirm_password = c.root.get("confirm_password").value;
    if (password != confirm_password) {
      return { ["mismatch"]: true };
    }
  };

  formConfirmPassword: ValidatorFn = (c: FormControl) => {
    // any component logic here
    var confirm_password = c.value;
    var password = c.root.get("password").value;
    if (confirm_password != password) {
      return { ["mismatch"]: true };
    }
  };
  email = (c: FormControl) => {
    let email: string = c.value;
    var regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      return {
        invalid: true,
      };
    }
  };
  isUrlValid = (c: FormControl) => {
    let url: string = c.value;
    var regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;
    if (!regex.test(url)) {
      return {
        invalid: true,
      };
    }
  };
  emptyString = (c: FormControl) => {
    var regex = /^\s*$/;
    if (regex.test(c.value)) {
      return { invalid: true };
    }
  };
}
