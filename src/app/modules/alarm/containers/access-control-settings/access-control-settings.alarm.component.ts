import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import {AppSettingsModel} from "../../models/appsettings.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { AccessControlSettingsAlarmService } from "./access-control-settings.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { ToastrService } from "ngx-toastr";
import { MatRadioChange } from '@angular/material/radio';
import { url } from 'inspector';
import { AlarmRoutingModule } from '../../alarm-routing.module';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: "alarm-access-control-settings",
  styleUrls: ["./access-control-settings.alarm.component.css"],
  templateUrl: "./access-control-settings.alarm.component.html"
})
export class AccessControlSettingsAlarmComponent implements OnInit {
  /*  auth_mode_list = [
     { checked: true, value: "LDAP", disable: false },
     { checked: false, value: "Native", disable: false },
   ]; */
  constructor(
    private access_contol_service: AccessControlSettingsAlarmService,
    private toastr_service: ToastrService,
    private router: Router
  ) { }
  ngOnInit() {
    this.getData();
  }
  // active_directory_list: any = [];
  active_directory_name = null;
  org_units = null;
  auth_mode_list = [
    { value: "LDAP" },
    { value: "NATIVE" }
  ];
  is_add = false;
  app_settings: AppSettingsModel = new AppSettingsModel();
  getData() {
     this.access_contol_service
      .getAppSettings()
      .subscribe((resp: ActionRes<Array<AppSettingsModel>>) => {
        if (resp.item && resp.item.length > 0) {
          this.app_settings = resp.item[0];
          console.log("app settings:", this.app_settings.ldap_config[0]);
          if (this.app_settings.ldap_config[0].OU_List.length > 0)
          {
            this.active_directory_name = this.app_settings.ldap_config[0].name;
            this.org_units = this.app_settings.ldap_config[0].OU_List[0];
          }
          //this.auth_mode_list = this.app_settings.auth_mode.toString();
          console.log(this.active_directory_name);
        }
      });
    // console.log("auth_mode_list: ", this.app_settings.auth_mode);
  }
  selectActiveDirectory(org_units) {
    this.org_units = org_units;
  }
  addActiveDirectory() {
    this.app_settings.ldap_config[0].OU_List.push({ name: "Enter OU Name" });
    this.selectActiveDirectory(
      this.app_settings.ldap_config[0].OU_List[this.app_settings.ldap_config[0].OU_List.length - 1]
    );
    this.is_add = true;
  }
  auth_mode_change(event: MatRadioChange) {
    // this.auth_mode_list[''] = event.value;
    // console.log("Radio event change: ", event.value);
    this.app_settings.auth_mode = event.value;
  }
  save = () => {
    var request = new ActionReq<AppSettingsModel>({
      item: this.app_settings
    });
    // console.log("Appsettings Save: ", this.app_settings);
    this.access_contol_service.saveAppSettings(request).subscribe(
      resp => {
        this.is_add = false;
        this.toastr_service.success("Settings Stored successfully");
      },
      error => {
        this.toastr_service.error("Error in Storing the Settings");
      }
    );
  };
cancel = () => {
  this.router.navigate(["alarm/accesscontrol"]);
}

  delete = () => {
    if (this.app_settings.ldap_config[0].OU_List.length > 0) {
      var index = _.findIndex(this.app_settings.ldap_config[0].OU_List, (v: any) => {
        return v.dn == this.org_units.dn;
      });
      var deleted_item = this.app_settings.ldap_config[0].OU_List.splice(index, 1);
      // update appsettings
      var request = new ActionReq<AppSettingsModel>({
        item: this.app_settings
      });
      this.access_contol_service.saveAppSettings(request).subscribe(
        resp => {
          this.is_add = false;
          if (this.app_settings.ldap_config[0].OU_List.length > 0) {
            this.selectActiveDirectory(this.app_settings.ldap_config[0].OU_List[0]);
          } else {
            this.selectActiveDirectory(null);
          }
          this.toastr_service.success("Deleted successfully");
        },
        error => {
          this.toastr_service.error("Error deleting");
        }
      );
    }
  };
}
