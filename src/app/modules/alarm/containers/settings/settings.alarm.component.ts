import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import ActionRes from "src/app/modules/global/model/actionres.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { ReferenceListModel } from "../../models/referencelist.model";
import { SettingsCriteria, SettingsModel } from "../../models/settings.model";
import { UserModel } from "../../models/user.model";
import { SettingAlarmService } from "./settings.alarm.service";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "alarm-settings",
  styleUrls: ["./settings.alarm.component.scss"],
  templateUrl: "./settings.alarm.component.html",
})
export class SettingsAlarmComponent implements OnInit {
  constructor(
    public translate: TranslateService,
    private router: Router,
    public service: SettingAlarmService,
    private toastr_service: ToastrService,
    public globalservice: GlobalService,
    public user_permission_guard: UserPermissionGuardService
  ) {
    // translate.addLangs(["en-GB", "es-ES", "fr-FR"]);
    // translate.setDefaultLang("es-ES");
  }
  ngOnInit() {
    this.getMetaData();
    this.getlangdata();
    this.getData();
  }
  dateFormatList = [];
  selected_date_format = "";
  selected_lang = "";
  selected_tag = [];
  selected_username_format = [];
  selected_rootuser_format = [];
  selected_rootProfile_format = [];
  global_data = new SettingsModel();
  access_date: any = [];
  language_list: Array<{ code: string; name: string }> = [];
  index: number = 0;
  application_data_str: UserModel = JSON.parse(
    localStorage.getItem("user_data")
  );
  tag_list = [];
  isRoot: boolean = false;

  displayedColumns: string[] = [
    "demo-position",
    "demo-name",
    "demo-weight",
    "demo-symbol",
  ];
  dataSource: any;

  getMetaData() {
    var req: string = "DATE_TIME_FORMAT";
    this.service.getDateTmeFormat(req).subscribe(
      (resp: ActionRes<Array<ReferenceListModel>>) => {
        if (resp.item) {
          this.dateFormatList = resp.item;
        }
      },
      (error) => {
        this.toastr_service.error("Error getting Date Formats");
      }
    );
  }
  getData() {
    var request = new SettingsModel();
    request.user_id = this.application_data_str.id;
    request.app_id = this.application_data_str.app_id;
    var req = new ActionReq<SettingsModel>({
      item: request,
    });
    this.service.getglobaldata(req).subscribe(
      (res: ActionRes<SettingsModel>) => {
        if (res.item) {
          this.global_data = res.item;
          if (
            this.global_data.is_factory &&
            request.user_id == this.global_data.user_id
          ) {
            this.isRoot = true;
          }
          this.global_data.value.forEach((v: SettingsModel.SettingsValue) => {
            if (v.key == SettingsModel.Settings.DATETIMEFORMAT) {
              this.selected_date_format = v.value[0];
            }
            if (v.key == SettingsModel.Settings.USERNAMEFORMAT) {
              this.selected_username_format = v.value;
            }
            if (v.key == SettingsModel.Settings.ROOTUSERFORMAT) {
              this.selected_rootuser_format = v.value;
            }
            if (v.key == SettingsModel.Settings.ROOTROLEFORMAT) {
              this.selected_rootProfile_format = v.value;
            }
            if (v.key == SettingsModel.Settings.LANGUAGECODE) {
              this.selected_lang = v.value[0];
              this.globalservice.lang_code = this.selected_lang;
              this.translate.use(this.globalservice.lang_code);
            }
            if (
              v.key == SettingsModel.Settings.TAG &&
              v.value_type == SettingsModel.ValueTypes.KeyValuePair
            ) {
              this.tag_list = v.value;
            }
          });

          // this.access_date = this.global_data.value;
          // this.index = this.access_date.findIndex((v) => {
          //   return v.key == "GLOBAL";
          // });
          // this.globalservice.global_value = this.access_date;
          // this.selected_date_format = this.access_date[this.index].datetime_format;
          // this.selected_username_format =
          //   this.access_date[this.index].username_format;
          // this.selected_rootuser_format =
          //   this.access_date[this.index].rootuser_format;
          // this.selected_rootProfile_format =
          //   this.access_date[this.index].root_roleprofile_format;
          // this.selected_lang = this.access_date[this.index].language_identifier;
          // this.globalservice.lang_code = this.selected_lang;
          // this.selected_tag = this.access_date[this.index].tag;
          // this.translate.use(this.globalservice.lang_code);
        }
      },
      (error) => {
        var error_msg =
          error && error.error && error.error.message
            ? error.error.message
            : "";
        this.toastr_service.error(
          error_msg.length > 0 ? error_msg : "Error saving"
        );
      }
    );
  }

  save(form: NgForm) {
    form.resetForm(form.value);
    if (form.valid) {
      var _req = new SettingsModel();
      _req.user_id = this.application_data_str.id;

      _req.id =
        _req.user_id == this.global_data.user_id
          ? this.global_data.id
          : _req.id;

      _req.app_id = this.application_data_str.app_id;
      _req.lang_code = this.selected_lang; //update lang_code external usage
      if (this.isRoot) {
        this.global_data.value.forEach((v: SettingsModel.SettingsValue) => {
          if (v.key == SettingsModel.Settings.DATETIMEFORMAT) {
            v.value[0] = this.selected_date_format;
          }
          if (v.key == SettingsModel.Settings.USERNAMEFORMAT) {
            v.value = this.selected_username_format;
          }
          if (v.key == SettingsModel.Settings.ROOTUSERFORMAT) {
            v.value = this.selected_rootuser_format;
          }
          if (v.key == SettingsModel.Settings.ROOTROLEFORMAT) {
            v.value = this.selected_rootProfile_format;
          }
          if (v.key == SettingsModel.Settings.LANGUAGECODE) {
            v.value[0] = this.selected_lang;
          }
          let lang = this.language_list.find((v2) => {
            return v2.code == this.selected_lang;
          });
          if (v.key == SettingsModel.Settings.LANGUAGENAME) {
            v.value[0] = lang.name;
          }
          if (v.key == SettingsModel.Settings.TAG) {
            v.value = this.tag_list;
          }
        });
        _req.value = this.global_data.value;
      } else {
        this.global_data.value.forEach((v: SettingsModel.SettingsValue) => {
          if (v.key == SettingsModel.Settings.DATETIMEFORMAT) {
            v.value[0] = this.selected_date_format;
          }
          if (v.key == SettingsModel.Settings.USERNAMEFORMAT) {
            v.value = this.selected_username_format;
          }
          if (v.key == SettingsModel.Settings.LANGUAGECODE) {
            v.value[0] = this.selected_lang;
          }
          let lang = this.language_list.find((v2) => {
            return v2.code == this.selected_lang;
          });
          if (v.key == SettingsModel.Settings.LANGUAGENAME) {
            v.value[0] = lang.name;
          }
          if (v.level == SettingsModel.SettingAccessKey.USER) {
            _req.value.push(v);
          }
        });
      }
      var request = new ActionReq<SettingsModel>({
        item: _req,
      });
      this.service.saveglobaldata(request).subscribe(
        (resp: ActionRes<SettingsModel>) => {
          if (resp.item) {
            this.toastr_service.success("Settings updated successfully");
            this.getData();
          }
        },
        (error) => {
          this.toastr_service.error("Error saving settings");
        }
      );
    }
  }

  cancel() {
    this.router.navigate(["../"]);
  }

  switchLang(lang: any) {
    this.selected_lang = lang;
  }

  // getTranslatelang() {
  //   var lang_list : Array<string> = [];

  //   lang_list = this.translate.getLangs();
  //   lang_list.forEach((v) => {
  //     var lang_str = "";
  //     lang_str = v;
  //     switch (lang_str) {
  //       case "en-GB":
  //         this.language_list.push({ key: "en-GB", value: "English" });
  //         break;
  //       case "es-ES":
  //         this.language_list.push({ key: "es-ES", value: "Spanish" });
  //         break;
  //       case "fr-FR":
  //         this.language_list.push({ key: "fr-FR", value: "French" });
  //         break;
  //       default:
  //         console.log("Invalid");
  //         break;
  //     }
  //   });
  // }
  username_list = [
    {
      code: "FIRST_NAME",
      display_text: "First Name",
    },
    {
      code: "MIDDLE_NAME",
      display_text: "Middle Name",
    },
    {
      code: "LAST_NAME",
      display_text: "Last Name",
    },
    {
      code: "COMMA",
      display_text: "Comma",
    },
    {
      code: "SPACE",
      display_text: "Space",
    },
  ];

  rootuser_list = [
    {
      code: "ROOT",
      display_text: "Root",
    },
    {
      code: "APPLICATION",
      display_text: "Application Name",
    },
    {
      code: "DOT",
      display_text: "Dot",
    },
    {
      code: "UNDERSCORE",
      display_text: "Underscore",
    },
  ];

  rootProfileList = [
    {
      code: "ROOT_ROLEPROFILE",
      display_text: "Root Role Profile",
    },
    {
      code: "APPLICATION",
      display_text: "Application Name",
    },
    {
      code: "DOT",
      display_text: "Dot",
    },
    {
      code: "UNDERSCORE",
      display_text: "Underscore",
    },
  ];

  getlangdata() {
    this.service.getEnvSettings().subscribe(
      (
        res: ActionRes<{
          lang_code: Array<{ code: string; name: string }>;
          auth_mode: string;
        }>
      ) => {
        if (res.item) {
          this.language_list = res.item.lang_code;
          let lang = [];
          lang = this.language_list.map((v) => {
            return v.code;
          });
          this.translate.addLangs(lang);
        }
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
}
