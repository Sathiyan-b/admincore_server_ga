import { Component, OnInit } from "@angular/core";
import { ValidatorService } from "../../service/validator/validator.service";
import { NgForm } from "@angular/forms";
import ActionReq from "../../model/actionreq.model";
import { UserModel } from "src/app/modules/alarm/models/user.model";
import { ResetPasswordService } from "./reset-password.service";
import ActionRes from "../../model/actionres.model";
import { ToastrService } from "ngx-toastr";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { PasswordValidatorService } from "../../service/validator/passwordvalidator.service";
import { PasswordpolicyService } from "src/app/modules/alarm/containers/password-policy/password.policy.service";
import { TranslateService } from "@ngx-translate/core";
import { PasswordPolicyModel } from "src/app/modules/alarm/models/passwordpolicy.model";
import { PopUpCommonComponent } from "src/app/modules/global/containers/pop-up-common/pop-up-common.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    public validator_service: ValidatorService,
    private reset_password_service: ResetPasswordService,
    private toastr_service: ToastrService,
    private router: Router,
    private passwordvalidator_service: PasswordValidatorService,
    private passwordpolicy_service: PasswordpolicyService,
    public translate: TranslateService,
    private alert_dialog: MatDialog
  ) {}

  ngOnInit() {
    this.passwordpolicy_service.getPasswordPolicy().subscribe(
      (resp: ActionRes<Array<PasswordPolicyModel>>) => {
        if (resp.item.length > 0) {
          this.passwordpolicy = resp.item[0];
        }
      },
      (error) => {
        this.toastr_service.error(
          "Error in fetching details of Password Policy"
        );
      }
    );
    this.getPasswordPolicy();
  }
  /* variables */
  show_email_form = true;
  show_login_form = true;
  show_password_form = false;
  email: string = "";
  login: string = "";
  otp: string = "";
  password: string = "";
  confirm_password: string = "";
  user: UserModel = new UserModel();
  passwordpolicy = new PasswordPolicyModel();
  is_verify_username: boolean = false;

  showPolicy = new PasswordPolicyModel();
  passwordStartWith: string = "";

  reset_password = {
    password: "",
    confirm_password: "",
  };

  email_toggle: boolean = true;

  getOtp(form: NgForm) {
    if(this.email.length == 0 && this.login.length ==0){
      this.toastr_service.error("give email/user name")
    }
    if (this.email.length > 0) {
      const alert = this.alert_dialog.open(PopUpCommonComponent, {
        data: {
          message: this.translate.instant(
            `Alert: Changing password with email will reflect on
             all the applications associated with this email address.`
          ),
        },
      });
      alert.afterClosed().subscribe((is_reset) => {
        if (is_reset) {
          this.cancel();
        } else {
          this.getOtpAPI(form);
        }
      });
    } else  {
      // if (this.login.length > 0) {
      //   const alert = this.alert_dialog.open(PopUpCommonComponent, {
      //     data: {
      //       message: this.translate.instant(
      //         `Note: ${this.email}`
      //       ),
      //     },
      //   });
      //   alert.afterClosed().subscribe((is_reset) => {
      //     if (is_reset) {
      //       this.cancel();
      //     } else {
      //       this.getOtpAPI(form);
      //     }
      //   });
      // }

      this.getOtpAPI(form);
    }
  }
  getOtpAPI = (form) => {
    if (this.email.length > 0) {
      this.is_verify_username = false;
    } else if (this.login.length > 0) {
      this.is_verify_username = true;
    }
    if (form.valid) {
      var request = new ActionReq<UserModel>({
        item: new UserModel({
          email: this.email,
          login: this.login,
        }),
      });
      this.reset_password_service.getOTP(request).subscribe(
        (resp: ActionRes<UserModel>) => {
          if (resp.item) {
            this.user = resp.item;
            this.show_email_form = false;
            this.show_login_form = false;
            this.show_password_form = true;
          }
        },
        (err) => {
          if (_.has(err, "error.message")) {
            this.toastr_service.error(err.error.message);
          } else {
            this.toastr_service.error("Error getting OTP");
          }
        }
      );
    }
  };
  resetPassword(form: NgForm) {
    if (form.valid) {
      // if (this.resetPassword) {
      if (
        this.reset_password.password != this.reset_password.confirm_password
      ) {
        this.toastr_service.error("Password Mismatch");
        return false;
      }

      if (this.passwordpolicy.id > 0) {
        console.log("this.passwordpolicy --", this.passwordpolicy);
        if (
          !this.passwordvalidator_service.validate(
            this.passwordpolicy,
            this.reset_password.password
          )
        ) {
          return false;
        }
      }
      // }
      if (this.is_verify_username) {
        var request = new ActionReq<UserModel>({
          item: new UserModel({
            id: this.user.id,
            password: this.reset_password.password,
            login: this.user.login,
            otp: this.otp,
          }),
        });
      } else {
        var request = new ActionReq<UserModel>({
          item: new UserModel({
            id: this.user.id,
            email: this.user.email,
            password: this.reset_password.password,
            otp: this.otp,
          }),
        });
      }

      this.reset_password_service.resetPassword(request).subscribe(
        (resp: ActionRes<UserModel>) => {
          if (resp.item) {
            this.toastr_service.success("Password updated");
            (<any>$("#changePasswordCollapse")).collapse("toggle");
            this.reset_password.confirm_password = "";
            this.reset_password.password = "";
          }
          this.router.navigate(["/login"]);
        },
        (err) => {
          if (_.has(err, "error.message")) {
            this.toastr_service.error(err.error.message);
          } else {
            this.toastr_service.error("Error getting OTP");
          }
        }
      );
    }
  }
  cancel() {
    this.router.navigate(["/login"]);
  }

  getPasswordPolicy() {
    this.passwordpolicy_service.getPasswordPolicy().subscribe(
      (resp: ActionRes<Array<PasswordPolicyModel>>) => {
        if (resp.item.length > 0) {
          this.showPolicy = resp.item[0];
        }
      },
      (error) => {
        this.toastr_service.error(
          this.translate.instant("Error in fetching details of Password Policy")
        );
      }
    );
  }
}
