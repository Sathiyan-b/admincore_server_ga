import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserModel } from "src/app/modules/alarm/models/user.model";
import { ValidatorService } from "src/app/modules/global/service/validator/validator.service";
import { ToastrService } from "ngx-toastr";
import { UserPasswordAlarmService } from "./password.service";
import { NgForm } from "@angular/forms";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import * as _ from "lodash";
import * as moment from "moment";
import {AppSettingsModel} from 'src/app/modules/alarm/models/appsettings.model';
import { Router } from "@angular/router";
import { PasswordValidatorService } from "src/app/modules/global/service/validator/passwordvalidator.service";
import { PasswordpolicyService } from 'src/app/modules/alarm/containers/password-policy/password.policy.service';
import PasswordPolicyModel from 'src/app/modules/alarm/models/passwordpolicy.model';


@Component({
  selector: "alarm-user-password",
  templateUrl: "./password.component.html",
  styleUrls: ["./password.component.css"],
})
export class UserPasswordComponent {
  constructor(
    private global_service: GlobalService,
    private validator_service: ValidatorService,
    private toastr_service: ToastrService,
    private user_profile_service: UserPasswordAlarmService,
    private router: Router,
    private passwordvalidator_service: PasswordValidatorService,
    private passwordpolicy_service: PasswordpolicyService
  ) {
    this.user = this.global_service.user_data;
    this.app_settings = this.global_service.app_settings;

    this.passwordpolicy_service.getPasswordPolicy().subscribe(
      (resp: ActionRes<Array<PasswordPolicyModel>>) => {

        if (resp.item.length > 0) {
          this.passwordpolicy = resp.item[0];
        }

      },
      (error) => {
        this.toastr_service.error(
          'Error in fetching details of Password Policy'
        );
      }
    );

  }
/* variables */
  passwordpolicy = new PasswordPolicyModel();;
  user: UserModel = new UserModel();
  app_settings = new AppSettingsModel();
  last_login = moment().format("MM/DD/YYYY HH:mm:ss");
  enterprise = "";
  location = "";
  isImageSaved: boolean = false;
  cardImageBase64: string;

  change_password = {
    pre_password:"",
    password: "",
    confirm_password: "",
  };

  changePassword(form: NgForm) {
    if (form.valid) {

      if (this.passwordpolicy.id > 0) {
        if (!this.passwordvalidator_service.validate(this.passwordpolicy, this.change_password.password)) {
          return false;
        }
      }


      var request = new ActionReq<UserModel>({
        item: new UserModel({
          id: this.user.id,
          password: this.change_password.password,
          pre_password: this.change_password.pre_password,
          old_password: this.user.password
        }),
      });
      this.user_profile_service.changePassword(request).subscribe(
        (resp: ActionRes<UserModel>) => {
          if (resp.item) {
            this.toastr_service.success("Password updated");
            this.router.navigate(["login"]);
          }
        },
        (err:any) => {
          var error_message = "Error in Password updation";
          if (_.has(err, "error.message")) error_message = err.error.message;
          this.toastr_service.error(error_message);
        }
      );
    }
  }
}

