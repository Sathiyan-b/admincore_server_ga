import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/modules/global/service/auth/auth-guard.service";
import { HomeAlarmComponent } from "./containers/home/home.alarm.component";
import { AlarmComponent } from "./alarm.component";
import { AccessControlAlarmComponent } from "./containers/access-control/access-control.alarm.component";
import { UserMergeAlarmComponent } from "./containers/user-merge/user-merge.alarm.component";
import { RoleMergeAlarmComponent } from "./containers/role-merge/role-merge.alarm.component";
import { AccessControlSettingsAlarmComponent } from "./containers/access-control-settings/access-control-settings.alarm.component";
import { EnterpriseMergeAlarmComponent } from "./containers/enterprise-merge/enterprise-merge.alarm.component";
import { LocationMergeAlarmComponent } from "./containers/location-merge/location-merge.alarm.component";
import { ImportLdapUsersAlarmComponent } from "./containers/import-ldap-users/import-ldap-users.alarm.component";
// import { UserTeamAlarmComponent } from "./containers/user-team/user-team.alarm.component";
import { UserTeamMergeAlarmComponent } from "./containers/user-team-merge/user-team-merge.alarm.component";

import { PointofcareMergeAlarmComponent } from "./containers/pointofcare-merge/pointofcare-merge.alarm.component";
import { ApplicationAlarmComponent } from "./containers/application/application.alarm.component";
import { ApplicationMergeAlarmComponent } from "./containers/application-merge/application-merge.alarm.component";
import { EnterpriseHierarchyAlarmComponent } from "./containers/enterprise-hierarchy/enterprise-hierarchy.alarm.component";
import { FabricJSAlarmComponent } from "./containers/fabric-js/fabric-js.alarm.component";
import { UserGuardService } from "../global/service/user-guard/user-guard.service";
import { PrivilegePermissions } from "../global/model/permission.model";
import { SettingsAlarmComponent } from "./containers/settings/settings.alarm.component";
import { DevicesAlarmComponent } from "./containers/devices/devices.alarm.component";
import { DeviceMergeAlarmComponent } from "./containers/device-merge/device-merge.alarm.component";
import { ImportDevicesAlarmComponent } from "./containers/import-devices/import-devices.alarm.component";
import { AlarmTestAlarmComponent } from "./containers/alarm-test/alarm-test.alarm.component";
import { AlarmMergeComponent } from "./containers/alarm-merge/alarm-merge.component";
import { GuardControlAlarmComponent } from "./containers/guard-control/guard-control.alarm.component";
import { PatientMedicationsAlarmComponent } from "./containers/patient-medications/patient-medications.alarm.component";

const alarm_routes: Routes = [
  {
    path: "",
    component: AlarmComponent,
    children: [
      {
        path: "",
        redirectTo: "accesscontrol",
        pathMatch: "full"
      },
      {
        path: "home",
        component: HomeAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "application",
        component: ApplicationAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [
            PrivilegePermissions.PERMISSIONS.CAN_VIEW_REGISTERED_APPLICATIONS
          ],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "application/applicationmerge",
        component: ApplicationMergeAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [
            PrivilegePermissions.PERMISSIONS.CAN_VIEW_REGISTERED_APPLICATIONS
          ],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "enterprise-hierarchy",
        component: EnterpriseHierarchyAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [
            PrivilegePermissions.PERMISSIONS.CAN_VIEW_ENTERPRISE
          ],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "fabric-js",
        component: FabricJSAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "accesscontrol",
        component: AccessControlAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "guardcontrol",
        component: GuardControlAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "accesscontrol/usermerge",
        component: UserMergeAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_USER],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "accesscontrol/rolemerge",
        component: RoleMergeAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [
            PrivilegePermissions.PERMISSIONS.CAN_MANAGE_ROLEPROFILE
          ],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "accesscontrol/settings",
        component: AccessControlSettingsAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [
            PrivilegePermissions.PERMISSIONS.CAN_MANAGE_SETTINGS
          ],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "accesscontrol/importldapusers",
        component: ImportLdapUsersAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_USER],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "accesscontrol/enterprisemerge",
        component: EnterpriseMergeAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [
            PrivilegePermissions.PERMISSIONS.CAN_MANAGE_ENTERPRISE
          ],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "accesscontrol/locationmerge",
        component: LocationMergeAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "accesscontrol/user-team-merge",
        component: UserTeamMergeAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_TEAM],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "accesscontrol/pointofcare-merge",
        component: PointofcareMergeAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [
            PrivilegePermissions.PERMISSIONS.CAN_MANAGE_POINT_OF_CARE
          ],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "accesscontrol/alarm-merge",
        component: AlarmMergeComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "Settings",
        component: SettingsAlarmComponent,
        canActivate: [AuthGuardService, UserGuardService],
        data: {
          permission_list: [PrivilegePermissions.PERMISSIONS.CAN_VIEW_SETTINGS],
          mode: PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY
        }
      },
      {
        path: "guardcontrol/devices",
        component: DevicesAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "guardcontrol/patient-medications",
        component: PatientMedicationsAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "guardcontrol/import-devices",
        component: ImportDevicesAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "guardcontrol/device-merge",
        component: DeviceMergeAlarmComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "guardcontrol/alarmtest",
        component: AlarmTestAlarmComponent,
        canActivate: [AuthGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(alarm_routes)],
  exports: [RouterModule]
})
export class AlarmRoutingModule {}
