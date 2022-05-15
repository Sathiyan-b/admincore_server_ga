import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import * as _ from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import PasswordPolicyModel from "../../models/passwordpolicy.model";
import { PasswordpolicyService } from "./password.policy.service";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { MatDialog } from "@angular/material/dialog";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { ToastrService } from "ngx-toastr";
import { UserModel } from "../../models/user.model";
import { TranslateService } from "@ngx-translate/core";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";

@Component({
  selector: "password-policy",
  templateUrl: "./password.policy.component.html",
  styleUrls: ["./password.policy.component.css"],
})
export class PasswordPolicyComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private password_policy_service: PasswordpolicyService,
    private alert_dialog: MatDialog,
    private global_service: GlobalService,
    private toastr_service: ToastrService,
    public translate: TranslateService,
    public user_permission_guard: UserPermissionGuardService
  ) {}

  passwordpolicy = new PasswordPolicyModel();

  ngOnInit() {
    this.password_policy_service.getPasswordPolicy().subscribe(
      (resp: ActionRes<Array<PasswordPolicyModel>>) => {
        // debugger;
        if (resp.item.length > 0) {
          this.passwordpolicy = resp.item[0];
        }
      },
      (error) => {
        this.toastr_service.error(
          this.translate.instant("Error in fetching details of Password Policy")
        );
      }
    );
  }

  numberValidation(Type: string, min: number, max: number) {
    if (Type == "Min") {
      if (this.passwordpolicy.min_length < min) {
        this.passwordpolicy.min_length = min;
      }
      if (this.passwordpolicy.min_length > max) {
        this.passwordpolicy.min_length = max;
      }
    } else if (Type == "Max") {
      if (this.passwordpolicy.max_length < min) {
        this.passwordpolicy.max_length = min;
      }
      if (this.passwordpolicy.max_length > max) {
        this.passwordpolicy.max_length = max;
      }
    }
  }

  onUppercaseChange(e) {
    if (this.passwordpolicy.can_allow_uppercase == false) {
      this.passwordpolicy.min_uppercase_reqd = false;
    }
  }

  onLowercaseChange(e) {
    if (this.passwordpolicy.can_allow_lowercase == false) {
      this.passwordpolicy.min_lowercase_reqd = false;
    }
  }

  onNumeralsChange(e) {
    if (this.passwordpolicy.can_allow_numerals == false) {
      this.passwordpolicy.min_numerals_reqd = false;
    }
  }

  onSpecialCharactersChange(e) {
    if (this.passwordpolicy.can_allow_special_characters == false) {
      this.passwordpolicy.min_special_characters_reqd = false;
    }
  }

  save(form: NgForm) {
    if (form.valid) {
      var user_data_str: UserModel = JSON.parse(
        localStorage.getItem("user_data")
      );
      this.passwordpolicy.app_id = user_data_str.app_id;
      // if(!this.passwordpolicy.can_allow_lowercase) {
      //   this.passwordpolicy.min_lowercase_reqd = !this.passwordpolicy.min_lowercase_reqd;
      // }
      // if(!this.passwordpolicy.can_allow_uppercase) {
      //   this.passwordpolicy.min_uppercase_reqd = !this.passwordpolicy.min_uppercase_reqd;
      // }
      // if(!this.passwordpolicy.can_allow_numerals) {
      //   this.passwordpolicy.min_numerals_reqd = !this.passwordpolicy.min_numerals_reqd;
      // }
      // if(!this.passwordpolicy.can_allow_special_characters) {
      //   this.passwordpolicy.min_special_characters_reqd = !this.passwordpolicy.min_special_characters_reqd;
      // }
      var request = new ActionReq<PasswordPolicyModel>({
        item: this.passwordpolicy,
      });
      if (this.passwordpolicy.id > 0) {
        this.password_policy_service.updatePasswordPolicy(request).subscribe(
          (resp) => {
            this.toastr_service.success(
            this.translate.instant(
              "Password Policy updated successfully"
            ))
          },
          (error) => {
            var error_msg = _.get(error, "error.error", "");
            this.toastr_service.error(
              error_msg.length > 0
                ? error_msg
                : this.translate.instant("Internal Error")
            );
          }
        );
      } else {
        this.password_policy_service.insertPasswordPolicy(request).subscribe(
          (resp) => {
            this.toastr_service.success(
              this.translate.instant(
                "Password Policy created successfully"
              )
            );
          },
          (error) => {
            var error_msg = _.get(error, "error.error", "");
            this.toastr_service.error(
              error_msg.length > 0
                ? error_msg
                : this.translate.instant("Internal Error")
            );
          }
        );
      }
    }
  }
}
