import { Injectable } from "@angular/core";
import { PasswordPolicyModel } from "src/app/modules/alarm/models/passwordpolicy.model";
import { ToastrService } from "ngx-toastr";
import { isNumber } from "util";
import * as _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class PasswordValidatorService {
  constructor(private toastr_service: ToastrService) {}

  validate(passwordPolicy: PasswordPolicyModel, password: string) {
    if (passwordPolicy.min_length > password.length) {
      this.toastr_service.error(
        "Min length of Password should be " + passwordPolicy.min_length
      );
      return false;
    }

    if (passwordPolicy.max_length < password.length) {
      this.toastr_service.error(
        "Max length of Password should be " + passwordPolicy.max_length
      );
      return false;
    }

    if (passwordPolicy.can_allow_numerals == true) {
      if (passwordPolicy.min_numerals_reqd) {
        let is_valid = /\d+/.test(password);
        if (!is_valid) {
          this.toastr_service.error("Minimum 1 Numeral Required in Password");
          return false;
        }
      }
    }

    if (passwordPolicy.can_allow_uppercase == true) {
      if (passwordPolicy.min_uppercase_reqd) {
        let is_valid = /[A-Z]/.test(password);
        if (!is_valid) {
          this.toastr_service.error("Minimum 1 Uppercase Required in Password");
          return false;
        }
      }
    }

    if (passwordPolicy.can_allow_lowercase == true) {
      if (passwordPolicy.min_lowercase_reqd) {
        let is_valid = /[a-z]/.test(password);
        if (!is_valid) {
          this.toastr_service.error("Minimum 1 Lowercase Required in Password");
          return false;
        }
      }
    }

    if (passwordPolicy.can_allow_special_characters == true) {
      var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
      var specialLength = 0;

      for (var i = 0; i < specialChars.length; i++) {
        if (password.indexOf(specialChars[i]) > -1) {
          specialLength = specialLength + 1;
        }
      }
      if (passwordPolicy.min_special_characters_reqd) {
        if (specialLength < 1) {
          this.toastr_service.error(
            "Minimum 1 Special Character Required in Password"
          );
          return false;
        }
      }
    }

    let regexpSpecial = /^[A-Za-z0-9 ]+$/;

    if (!passwordPolicy.can_allow_numerals) {
      if (/\d+/.test(password)) {
        this.toastr_service.error("The Password Numeric not allowed");
        return false;
      }
    }

    if (!passwordPolicy.can_allow_uppercase) {
      if (/[A-Z]/.test(password)) {
        this.toastr_service.error("The Password Uppercase not allowed");
        return false;
      }
    }

    if (!passwordPolicy.can_allow_lowercase) {
      if (/[a-z]/.test(password)) {
        this.toastr_service.error("The Password Lowercase not allowed");
        return false;
      }
    }

    if (!passwordPolicy.can_allow_special_characters) {
      if (!regexpSpecial.test(password)) {
        this.toastr_service.error(
          "The Password Special Characters not allowed"
        );
        return false;
      }
    }

    return true;
  }
}
