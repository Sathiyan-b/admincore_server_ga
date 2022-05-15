import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { PrivilegePermissions } from "src/app/modules/global/model/permission.model";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";

@Component({
  selector: "alarm-guard-control",
  styleUrls: ["./guard-control.alarm.component.css"],
  templateUrl: "./guard-control.alarm.component.html",
})
export class GuardControlAlarmComponent implements OnInit {
  TabIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private global_service: GlobalService,
    public user_permission_guard: UserPermissionGuardService
  ) {}
  ngOnInit() {
    // this.translate.use(localStorage.getItem("lang_code") ? localStorage.getItem("lang_code"): "en-GB" )
    this.translate.use(this.global_service.lang_code);

    this.route.queryParams.subscribe((params) => {
      let isRoleList = _.get(params, "rolelist", "");

      if (isRoleList == "true") {
        this.TabIndex = 0;
      }
      let userteam = _.get(params, "userteam", "");
      if (userteam == "true") {
        this.TabIndex = 2;
      }
      let pointofcare = _.get(params, "pointofcare", "");
      if (pointofcare == "true") {
        this.TabIndex = 3;
      }
    });
  }

  goToAccessControlSettings() {
    this.router.navigate(["settings"], { relativeTo: this.route });
  }
}
