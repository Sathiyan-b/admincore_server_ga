import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserModel } from "../../models/user.model";
import { ValidatorService } from "src/app/modules/global/service/validator/validator.service";
import { ToastrService } from "ngx-toastr";
import { UserprofileAlarmService } from "./user-profile.alarm.service";
import { NgForm } from "@angular/forms";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import * as _ from "lodash";
import * as moment from "moment";
import { AppSettingsModel } from "../../models/appsettings.model";
import { FileManagerModel } from "../../models/filemanager.model";
import { PasswordValidatorService } from "src/app/modules/global/service/validator/passwordvalidator.service";
import { PasswordpolicyService } from "../password-policy/password.policy.service";
import PasswordPolicyModel from "../../models/passwordpolicy.model";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: "alarm-user-profile-dialog",
  templateUrl: "./user-profile.alarm.dialog.html",
  styleUrls: ["./user-profile.alarm.dialog.css"],
})
export class UserProfileAlarmDialog {
  constructor(
    public dialogRef: MatDialogRef<UserProfileAlarmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global_service: GlobalService,
    public validator_service: ValidatorService,
    private toastr_service: ToastrService,
    private user_profile_service: UserprofileAlarmService,
    private passwordvalidator_service: PasswordValidatorService,
    private passwordpolicy_service: PasswordpolicyService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.user = this.global_service.user_data;
    this.app_settings = this.global_service.app_settings;
    console.log(this.user);

    if (typeof this.user.enterprise as Object) {
      this.enterprise = this.user.enterprise.display_text;
    }

    if (typeof this.user.location as Object) {
      this.location = this.user.location.display_text;
    }
    if (this.user.user_image_id != 0 && this.user.user_image_id != null) {
      this.isImageSaved = true;
      this.user_profile_service
        .getFileManager(this.user.user_image_id)
        .subscribe((resp: ActionRes<Array<FileManagerModel>>) => {
          if (resp.item.length > 0) {
            let base64String = "";
            _.forEach(resp.item[0].content.data, (v: any, k: any) => {
              base64String = base64String + String.fromCharCode(v);
            });
            this.cardImageBase64 = base64String;
          }
        });
    }

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
  }
  /* variables */
  user: UserModel = new UserModel();
  app_settings = new AppSettingsModel();
  last_login = moment().format("MM/DD/YYYY HH:mm:ss");
  enterprise = "";
  location = "";
  isImageSaved: boolean = false;
  cardImageBase64: string;
  passwordpolicy = new PasswordPolicyModel();

  change_password = {
    password: "",
    confirm_password: "",
  };
  onNoClick(): void {
    this.dialogRef.close();
  }
  changePassword(form: NgForm) {
    if (form.valid) {
      if (this.changePassword) {
        if (
          this.change_password.password != this.change_password.confirm_password
        ) {
          this.toastr_service.error("Password Mismatch");
          return false;
        }

        if (this.passwordpolicy.id > 0) {
          if (
            !this.passwordvalidator_service.validate(
              this.passwordpolicy,
              this.change_password.password
            )
          ) {
            return false;
          }
        }
      }

      var request = new ActionReq<UserModel>({
        item: new UserModel({
          id: this.user.id,
          password: this.change_password.password,
        }),
      });
      this.user_profile_service.changePassword(request).subscribe(
        (resp: ActionRes<UserModel>) => {
          if (resp.item) {
            this.toastr_service.success("Password updated");
            (<any>$("#changePasswordCollapse")).collapse("toggle");
            this.change_password.confirm_password = "";
            this.change_password.password = "";
          }
        },
        (err) => {
          var error_message = "Error in Password updation";
          if (_.has(err, "error.message")) error_message = err.error.message;
          this.toastr_service.error(error_message);
        }
      );
    }
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 50000;
      const allowed_types = ["image/png", "image/jpeg"];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.toastr_service.error("Maximum size allowed is 50 kb");

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.toastr_service.error("Only Images are allowed ( JPG | PNG )");

        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          const img_height = rs.currentTarget["height"];
          const img_width = rs.currentTarget["width"];

          console.log(img_height, img_width);

          if (img_height > max_height && img_width > max_width) {
            this.toastr_service.error(
              "Maximum dimentions allowed " +
                max_height +
                "*" +
                max_width +
                "px"
            );
            return false;
          } else {
            debugger;

            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            console.log(this.cardImageBase64);
            this.isImageSaved = true;

            var request = new ActionReq<FileManagerModel>({
              item: new FileManagerModel({
                id: this.user.user_image_id,
                category: "USER",
                content: this.cardImageBase64,
              }),
            });

            if (
              this.user.user_image_id != 0 &&
              this.user.user_image_id != null
            ) {
              this.user_profile_service.updateFileManager(request).subscribe(
                (resp: ActionRes<FileManagerModel>) => {
                  if (resp.item) {
                    this.toastr_service.success("Image updated");
                    this.userUpdateImage(resp.item);
                  }
                },
                (err) => {
                  var error_message = "Error in Image updation";
                  if (_.has(err, "error.message"))
                    error_message = err.error.message;
                  this.toastr_service.error(error_message);
                }
              );
            } else {
              this.user_profile_service.insertFileManager(request).subscribe(
                (resp: ActionRes<FileManagerModel>) => {
                  if (resp.item) {
                    this.toastr_service.success("Image updated");
                    this.userUpdateImage(resp.item);
                  }
                },
                (err) => {
                  var error_message = "Error in Image updation";
                  if (_.has(err, "error.message"))
                    error_message = err.error.message;
                  this.toastr_service.error(error_message);
                }
              );
            }
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  userUpdateImage(FileManagerModel: FileManagerModel) {
    var request = new ActionReq<UserModel>({
      item: new UserModel({
        id: this.user.id,
        user_image_id: FileManagerModel.id,
      }),
    });

    this.user_profile_service.updateImage(request).subscribe(
      (resp: ActionRes<UserModel>) => {
        if (resp.item) {
          //this.toastr_service.success("Image updated");
        }
      },
      (err) => {
        var error_message = "Error in User Image updation";
        if (_.has(err, "error.message")) error_message = err.error.message;
        this.toastr_service.error(error_message);
      }
    );
  }
  cancel() {
    this.dialogRef.close();
  }
}
