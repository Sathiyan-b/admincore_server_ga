import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as $ from "jquery";
import { AuthService } from "src/app/modules/global/service/auth/auth.service";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserModel } from "../../models/user.model";
import { MatDialog } from "@angular/material/dialog";
import { UserProfileAlarmDialog } from "../../containers/user-profile/user-profile.alarm.dialog";
import { UserprofileAlarmService } from "../../containers/user-profile/user-profile.alarm.service";
import { FileManagerModel } from "../../models/filemanager.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { EnterpriseAlarmService } from "../../containers/enterprise/enterprise.alarm.service";
import { EnterpriseModel } from "../../models/enterprise.model";
import { PrivilegePermissions } from "src/app/modules/global/model/permission.model";
import { Router } from "@angular/router";
// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "alarm-sidebar",
  templateUrl: "./alarm-sidebar.component.html",
  styleUrls: ["./alarm-sidebar.component.scss"],
})
export class AlarmSidebarComponent implements OnInit {
  user: UserModel;
  permissions: any = {};
  isImageSaved: boolean = false;
  cardImageBase64: string = "";
  isLogSaved: boolean = false;
  LogImageBase64: string = "";

  @ViewChild("FileUpload") FileUpload: ElementRef;

  enterprise_image_id = 0;
  menu_list: Array<any> = [];

  constructor(
    private auth_service: AuthService,
    private router: Router,
    private global_service: GlobalService,
    public dialog: MatDialog,
    private user_profile_service: UserprofileAlarmService,
    private toastr_service: ToastrService,
    private enterprise_service: EnterpriseAlarmService // public translate: TranslateService
  ) {
    // translate.setDefaultLang('en');
    this.user = this.global_service.user_data;
    this.permissions = this.global_service.permission_object;

    if (this.user.user_image_id != 0 && this.user.user_image_id != null) {
      this.user_profile_service
        .getFileManager(this.user.user_image_id)
        .subscribe((resp: ActionRes<Array<FileManagerModel>>) => {
          if (resp.item.length > 0) {
            this.isImageSaved = true;
            let base64String = "";
            _.forEach(resp.item[0].content.data, (v: any, k: any) => {
              base64String = base64String + String.fromCharCode(v);
            });
            this.cardImageBase64 = base64String;
          }
        });
    }

    if (typeof this.user.enterprise as Object) {
      let enterpriseID = this.user.enterprise.id;
      if (enterpriseID) {
        this.enterprise_service
          .getEnterpriseById(enterpriseID)
          .subscribe((resp: ActionRes<EnterpriseModel>) => {
            if (resp.item.image_id > 0) {
              this.enterprise_image_id = resp.item.image_id;
              this.user_profile_service
                .getFileManager(resp.item.image_id)
                .subscribe((resp: ActionRes<Array<FileManagerModel>>) => {
                  if (resp.item.length > 0) {
                    this.isLogSaved = true;
                    let base64String = "";
                    _.forEach(resp.item[0].content.data, (v: any, k: any) => {
                      base64String = base64String + String.fromCharCode(v);
                    });
                    this.LogImageBase64 = base64String;
                  }
                });
            }
          });
      }
    }
  }
  ngOnInit() {
    this.loadMenu();
  }
  loadMenu() {
    // this.menu_list = [
    //   {
    //     link: "accesscontrol",
    //     label: "Access Control",
    //     img: "assets/icons/accesscontrol.png",
    //   },
    //   {
    //     link: "application",
    //     label: "Application",
    //     img: "assets/icons/application.png",
    //   },
    //   {
    //     link: "enterprise-hierarchy",
    //     label: "Enterprise",
    //     img: "assets/icons/enterprise.png",
    //   },
    //   {
    //     link: "devices",
    //     label: "Devices",
    //     img: "assets/icons/infusion-device.png",
    //   },
    //   { link: "Settings", label: "Settings", img: "assets/icons/settings.png" },
    // ];
    this.menu_list.push(
      {
        link: "accesscontrol",
        label: "Access Control",
        img: "assets/icons/accesscontrol.png",
      },
      {
        link: "guardcontrol",
        label: "Guard",
        img: "assets/icons/infusion-device.png",
      }
    );
    if (
      this.auth_service.matchPermissions(
        [PrivilegePermissions.PERMISSIONS.CAN_VIEW_ENTERPRISE],
        PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
      )
    ) {
      this.menu_list.push({
        link: "enterprise-hierarchy",
        label: "Enterprise",
        img: "assets/icons/enterprise.png",
      });
    }
    if (
      this.auth_service.matchPermissions(
        [PrivilegePermissions.PERMISSIONS.CAN_VIEW_REGISTERED_APPLICATIONS],
        PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
      )
    ) {
      this.menu_list.push({
        link: "application",
        label: "Application",
        img: "assets/icons/application.png",
      });
    }
    if (
      this.auth_service.matchPermissions(
        [PrivilegePermissions.PERMISSIONS.CAN_VIEW_SETTINGS],
        PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
      )
    ) {
      this.menu_list.push({
        link: "Settings",
        label: "Settings",
        img: "assets/icons/settings.png",
      });
    }
  }
  logout() {
    this.auth_service.logout();
  }
  openUserProfileDialog(): void {
    const dialogRef = this.dialog.open(UserProfileAlarmDialog, {
      // width: "250px",
      width: "30vw",
      height: "80mh",
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
            // debugger;

            const imgBase64Path = e.target.result;
            this.LogImageBase64 = imgBase64Path;
            this.isLogSaved = true;

            var request = new ActionReq<FileManagerModel>({
              item: new FileManagerModel({
                id: this.enterprise_image_id,
                category: "ENTERPRISE",
                content: this.LogImageBase64,
              }),
            });

            if (
              this.enterprise_image_id != 0 &&
              this.enterprise_image_id != null
            ) {
              this.user_profile_service.updateFileManager(request).subscribe(
                (resp: ActionRes<FileManagerModel>) => {
                  if (resp.item) {
                    this.toastr_service.success("Image updated");
                    this.enterpriseUpdateImage(resp.item);
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
                    this.enterpriseUpdateImage(resp.item);
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

  onClickImage(event) {
    const fileUpload = this.FileUpload.nativeElement;
    fileUpload.onchange = () => {
      this.fileChangeEvent(event);
    };
    fileUpload.click();
  }

  enterpriseUpdateImage(FileManagerModel: FileManagerModel) {
    var request = new ActionReq<EnterpriseModel>({
      item: new EnterpriseModel({
        id: this.user.id,
        image_id: FileManagerModel.id,
      }),
    });

    this.enterprise_service.updateImage(request).subscribe(
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
}
