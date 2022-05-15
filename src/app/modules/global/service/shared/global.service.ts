import { Injectable } from "@angular/core";
import { AppSettingsModel } from "src/app/modules/alarm/models/appsettings.model";
import { UserModel } from "src/app/modules/alarm/models/user.model";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
import { json_custom_parser, json_custom_stringifier } from "../../utils";
import { ConditionalExpr } from "@angular/compiler";
import { SettingsModel } from "src/app/modules/alarm/models/settings.model";
import { PrivilegeModel } from "src/app/modules/alarm/models/privilege.model";
@Injectable({
  providedIn: "root",
})
export class GlobalService {
  _app_settings: AppSettingsModel;
  _user_data: UserModel;
  permission_object: any = {};
  redirect_url: string = "";
  _lang_code: string = "";
  _global_value: Array<Object> = [];
  Date_format: string = "";
  username_format = [];
  rootuser_format = [];
  root_roleprofile_format = [];
  private _permission_map_list: Array<PrivilegeModel> = [];
  constructor(private router: Router) {}
  get user_data() {
    return this._user_data;
  }
  set user_data(value) {
    this._user_data = value;
    var privilege_object = _.keyBy(this._user_data.privileges, "privilege_key");
    this.permission_object = {
      user: {
        change_status: _.get(privilege_object, "MAY_ALTER_USER_STATUS", false)
          ? true
          : false,
        view: _.get(privilege_object, "MAY_VIEW_USER", false) ? true : false,
        manage: _.get(privilege_object, "MAY_MANAGE_USER", false)
          ? true
          : false,
      },
      roleprofile: {
        change_status: _.get(
          privilege_object,
          "MAY_ALTER_ROLEPROFILE_STATUS",
          false
        )
          ? true
          : false,
        view: _.get(privilege_object, "MAY_VIEW_ROLEPROFILE", false)
          ? true
          : false,
        manage: _.get(privilege_object, "MAY_MANAGE_ROLEPROFILE", false)
          ? true
          : false,
      },
      accesscontrol: {
        manage: _.get(privilege_object, "MAY_MANAGE_ACCESS_CONTROL", false)
          ? true
          : false,
      },
      device: {
        change_status: _.get(privilege_object, "MAY_ALTER_DEVICE_STATUS", false)
          ? true
          : false,
        view: _.get(privilege_object, "MAY_VIEW_DEVICE", false) ? true : false,
        manage: _.get(privilege_object, "MAY_MANAGE_DEVICE", false)
          ? true
          : false,
      },
    };
  }
  get app_settings() {
    return this._app_settings;
  }
  set app_settings(_app_settings) {
    this._app_settings = _app_settings;
  }
  get lang_code() {
    if (this._lang_code.length == 0) {
      let temp_lang_code: string = localStorage.getItem("lang_code");
      if (temp_lang_code) {
        this._lang_code = temp_lang_code;
      }
    }
    return this._lang_code;
  }
  set lang_code(value: string) {
    localStorage.setItem("lang_code", value);
    this._lang_code = value;
  }
  get auth_mode() {
    return localStorage.getItem("auth_mode");
  }
  set auth_mode(auth_mode) {
    localStorage.setItem("auth_mode", auth_mode);
  }
  get global_value() {
    if (this._global_value.length == 0) {
      let temp_value = json_custom_parser.parse(
        localStorage.getItem("global_value"),
        []
      );
      if (temp_value) {
        this._global_value = temp_value;
      }
    }
    return this._global_value;
  }
  set global_value(value) {
    localStorage.setItem(
      "global_value",
      json_custom_stringifier.stringify(value)
    );
    this._global_value = value;
  }

  getFormat() {
    var global_data = [];
    global_data = this.global_value;
    // var index = format.findIndex((v) => {
    //   return v.key == "GLOBAL";
    // });
    // this.Date_format = format[index].datetime_format;
    // this.username_format = format[index].username_format;
    // this.rootuser_format = format[index].rootuser_format;
    // this.root_roleprofile_format = format[index].root_roleprofile_format;
      global_data.forEach((v: SettingsModel.SettingsValue)=>{
      if(v.key == SettingsModel.Settings.DATETIMEFORMAT) {
        this.Date_format = v.value[0];
      }
      if(v.key == SettingsModel.Settings.USERNAMEFORMAT) {
        this.username_format = v.value;
      }
      if(v.key == SettingsModel.Settings.ROOTUSERFORMAT) {
        this.rootuser_format = v.value;
      }
      if(v.key == SettingsModel.Settings.ROOTROLEFORMAT) {
        this.root_roleprofile_format = v.value;
      }
    })
  }

  formatDateTime(_req: Date): string {
    var result = "";
    try {
      var year: number = moment(_req).year();
      if (_.includes([1, 9999, 10000], year)) {
        return "";
      }
      if (_req != null) {
        this.getFormat();
        // var settings = this.getGlobalSettings();
        result = moment(_req).format(this.Date_format as string);
      }
    } catch (error) {
      throw error;
    }
    return result;
  }
  formatUsername(f_name: string, m_name: string, l_name: string) {
    var result = "";
    try {
      this.getFormat();
      this.username_format.forEach((v) => {
        switch (v) {
          case "FIRST_NAME":
            result = result + f_name;
            break;
          case "MIDDLE_NAME":
            result = result + m_name;
            break;
          case "LAST_NAME":
            result = result + l_name;
            break;
          case "COMMA":
            result = result + ",";
            break;
          case "SPACE":
            result = result + " ";
            break;
          default:
            console.log("Error on Username Format");
            break;
        }
      });
    } catch (error) {
      throw error;
    }
    return result;
  }
  formatrootuser(app_name: string) {
    var result = "";
    try {
      this.getFormat();
      this.rootuser_format.forEach((v) => {
        switch (v) {
          case "APPLICATION":
            result = result + app_name;
            break;
          case "ROOT":
            result = result + "ROOT";
            break;
          case "DOT":
            result = result + ".";
            break;
          case "UNDERSCORE":
            result = result + "_";
            break;
          default:
            console.log("Error on Username Format");
            break;
        }
      });
    } catch (error) {
      throw error;
    }
    return result;
  }
  formatrootroleprofile(app_name: string) {
    var result = "";
    try {
      this.getFormat();
      this.root_roleprofile_format.forEach((v) => {
        switch (v) {
          case "APPLICATION":
            result = result + app_name;
            break;
          case "ROOT_ROLEPROFILE":
            result = result + "ROOTROLE";
            break;
          case "DOT":
            result = result + ".";
            break;
          case "UNDERSCORE":
            result = result + "_";
            break;
          default:
            console.log("Error on UserRole Format");
            break;
        }
      });
    } catch (error) {
      throw error;
    }
    return result;
  }
  set permission_map_list(value: Array<PrivilegeModel>) {
    let permission_map_list_string: string =
      json_custom_stringifier.stringify(value);

    localStorage.setItem("permission_map_list", permission_map_list_string);
    this._permission_map_list = value;
  }
  get permission_map_list() {
    if (this._permission_map_list.length == 0) {
      var temp = json_custom_parser.parse(
        localStorage.getItem("permission_map_list"),
        null
      );
      if (temp != null) {
        this._permission_map_list = temp;
      }
    }
    return this._permission_map_list;
  }
}
