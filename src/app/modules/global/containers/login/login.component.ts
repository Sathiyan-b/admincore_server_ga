import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "./login.service";
import { ToastrService } from "ngx-toastr";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { AuthService } from "src/app/modules/global/service/auth/auth.service";
import { SharedService } from "src/app/modules/global/service/shared/shared.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { Auth } from "src/app/modules/alarm/models/auth.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { AppSettingsModel } from "src/app/modules/alarm/models/appsettings.model";
import * as _ from "lodash";
import { ApplicationWrapper } from "src/app/modules/alarm/models/application.model";
import ErrorResponse from "../../model/errorres.model";
import { ApplicationService } from "src/app/modules/alarm/service/application.service";
import { TranslateService } from "@ngx-translate/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { SettingAlarmService } from "src/app/modules/alarm/containers/settings/settings.alarm.service";
import { SettingsModel } from "src/app/modules/alarm/models/settings.model";
import { UserModel } from "src/app/modules/alarm/models/user.model";
import { StorageService } from "src/app/modules/alarm/service/storage.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  // providers: [GlobalService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  app_settings = new AppSettingsModel();
  is_external_app: boolean = false;
  application: ApplicationWrapper = new ApplicationWrapper();
  is_metadata_loading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private auth_service: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private global_service: GlobalService,
    private route: ActivatedRoute,
    private application_service: ApplicationService,
    public translate: TranslateService,
    public settingservice: SettingAlarmService,
    private storageService: StorageService
  ) {
    // translate.use(this.global_service.lang_code)
    this.app_settings = this.global_service.app_settings;
  }
  auth_mode = this.global_service.app_settings.auth_mode;
  lang_list = [];
  selected_lang: string = "";
  global_data: SettingsModel = new SettingsModel();
  access_date = [];
  language_list = [];
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.getDataWithParams();
  }

  getuserlang() {
    var request = new SettingsModel();
    var application_data_str: UserModel = JSON.parse(
      localStorage.getItem("user_data")
    );
    request.user_id = application_data_str.id;
    request.app_id = application_data_str.app_id;
    var req = new ActionReq<SettingsModel>({
      item: request,
    });
    this.settingservice.getglobaldata(req).subscribe(
      (res: ActionRes<SettingsModel>) => {
        if (res.item) {
          var index: number = 0;
          this.global_data = res.item;
          this.global_service.global_value = this.global_data.value;
          this.global_data.value.forEach((v: SettingsModel.SettingsValue)=>{
            if(v.key == SettingsModel.Settings.LANGUAGECODE) {
              this.selected_lang = v.value[0];
              this.global_service.lang_code = this.selected_lang;
              this.translate.use(this.global_service.lang_code);
            }
          });
          // console.log("test",res.item)
          // this.access_date = this.global_data.value;
          // index = this.access_date.findIndex((v) => {
          //   return v.key == "GLOBAL";
          // });
          // this.global_service.global_value = this.access_date;
          // this.selected_format = this.access_date[index].datetime_format;
          // this.selected_username_format = this.access_date[index].username_format;
          // this.global_service.lang_code = this.selected_lang;
          // this.translate.use(this.global_service.lang_code);
        }
      },
      (error) => {
        var error_msg =
          error && error.error && error.error.message
            ? error.error.message
            : "";
        this.toastrService.error(
          error_msg.length > 0 ? error_msg : "Error saving"
        );
      }
    );
  }
  setMetaDataLoading(arg: boolean) {
    this.is_metadata_loading = arg;
  }
  getDataWithParams() {
    this.route.queryParams.subscribe((params) => {
      if (params && params.app_key) {
        this.is_external_app = true;
        this.application.app_key = params.app_key;
        this.getdata();
      }
    });
  }
  async getdata() {
    this.setMetaDataLoading(true);
    try {
      let application_req = new ApplicationWrapper();
      application_req.app_key = this.application.app_key;
      let application_list = await this.application_service.get(
        application_req
      );
      if (application_list.length > 0) {
        this.application = application_list[0];
        this.application.app_key = application_req.app_key;
      }
    } catch (error) {
      var message: string = "couldn't get data";
      if (error.error && error.error instanceof ErrorResponse) {
        message = error.error.message;
      }
      this.toastrService.error(message);
    } finally {
      this.setMetaDataLoading(false);
    }
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.is_external_app) {
      var request = new ActionReq<Auth>({
        item: new Auth({
          login: this.f.username.value,
          password: this.f.password.value,
          app_key: this.application.app_key,
        }),
      });
    } else {
      var request = new ActionReq<Auth>({
        item: new Auth({
          login: this.f.username.value,
          password: this.f.password.value,
        }),
      });
    }
    this.auth_service.login(request, this.is_external_app).subscribe(
      (data: ActionRes<Auth>) => {
        if (this.is_external_app == false) {
          localStorage.setItem("token", data.item.token);
          localStorage.setItem("refresh_token", data.item.refresh_token);
          localStorage.setItem("user_data", JSON.stringify(data.item.user));
          this.global_service.user_data = data.item.user;
          this.global_service.permission_map_list = data.item.user.privileges;
          if (this.global_service.user_data.force_password_change == true) {
            // this.router.navigateByUrl(redirect);
            this.router.navigate(["changepassword"]);
          } else {
            this.getuserlang();
            // let redirect = this.auth_service.redirect_url != ""
            //   ? this.router.parseUrl(this.auth_service.redirect_url)
            //   : "/";
            // this.router.navigateByUrl(redirect);
            this.router.navigateByUrl("/alarm");
          }
        } else {
          window.location.href =
            this.application.success_callback +
            `?access_token=${data.item.token}`;
        }
      },
      (error: any) => {
        console.log(error);
        this.loading = false;
        var error_message: string;
        if (this.auth_mode == "LDAP")
          error_message =
            "Authentication Failed. Please check Directory connectivity and /or Credentials";
        else
          error_message =
            "Authentication Failed. Please check connectivity and / or Credentials";
        if (_.has(error, "error.message")) {
          error_message = error.error.message;
        }
        this.toastrService.error(error_message, "Login", {
          timeOut: 3000,
          progressBar: true,
        });
        // if (this.is_external_app == true) {
        //   window.location.href = this.application.success_callback;
        // }
      }
    );
  }
  getEnvSettings() {
    this.settingservice.getEnvSettings().subscribe(
      (
        res: ActionRes<{
          lang_code: Array<{ code: string; name: string }>;
          auth_mode: string;
        }>
      ) => {
        if (res.item) {
          this.global_service.auth_mode = res.item.auth_mode;
        }
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
}
