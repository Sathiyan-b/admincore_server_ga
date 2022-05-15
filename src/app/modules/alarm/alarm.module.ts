// Angular Imports
import { NgModule } from "@angular/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
// material imports
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";

// routing module

// Tree module
import { TreeModule } from "@circlon/angular-tree-component";

// QR module
import { QRCodeModule } from "angularx-qrcode";

// components
import { HttpClientHelper } from "../global/service/helpers/HttpClientHelper";

// ui components
import { AlarmHeaderComponent } from "./base/alarm-header/alarm-header.component";
import { AlarmSidebarComponent } from "./base/alarm-sidebar/alarm-sidebar.component";

// screens
import { SharedModule } from "src/app/modules/global/global.module";
import { HomeAlarmComponent } from "./containers/home/home.alarm.component";
import { AlarmRoutingModule } from "./alarm-routing.module";
import { AlarmComponent } from "./alarm.component";
import { AccessControlAlarmComponent } from "./containers/access-control/access-control.alarm.component";
import { UsersAlarmComponent } from "./containers/users/users.alarm.component";
import { UserMergeAlarmComponent } from "./containers/user-merge/user-merge.alarm.component";
import { RolesAlarmComponent } from "./containers/roles/roles.alarm.component";
import { RoleMergeAlarmComponent } from "./containers/role-merge/role-merge.alarm.component";
import { AccessControlSettingsAlarmComponent } from "./containers/access-control-settings/access-control-settings.alarm.component";
import { EnterpriseAlarmComponent } from "./containers/enterprise/enterprise.alarm.component";
import { EnterpriseMergeAlarmComponent } from "./containers/enterprise-merge/enterprise-merge.alarm.component";
import { LocationAlarmComponent } from "./containers/location/location.alarm.component";
import { LocationMergeAlarmComponent } from "./containers/location-merge/location-merge.alarm.component";
import { ImportLdapUsersAlarmComponent } from "./containers/import-ldap-users/import-ldap-users.alarm.component";
import { UserProfileAlarmDialog } from "./containers/user-profile/user-profile.alarm.dialog";
import { PopupCommonComponent } from "./containers/popup-common/popup-common.component";
import { UserTeamAlarmComponent } from "./containers/user-team/user-team.alarm.component";
import { PasswordPolicyComponent } from "./containers/password-policy/password.policy.component";
import { UserTeamMergeAlarmComponent } from "./containers/user-team-merge/user-team-merge.alarm.component";
import { PointofcareAlarmComponent } from "./containers/pointofcare/pointofcare.alarm.component";
import { PointofcareMergeAlarmComponent } from "./containers/pointofcare-merge/pointofcare-merge.alarm.component";

import { FilterPipe } from "src/app/modules/global/service/validator/filter.pipe";
import { ApplicationAlarmComponent } from "./containers/application/application.alarm.component";
import { ApplicationMergeAlarmComponent } from "./containers/application-merge/application-merge.alarm.component";
import { EnterpriseHierarchyNodeComponent } from "./containers/enterprise-hierarchy-node/enterprise-hierarchy-node.component";
import { EnterpriseHierarchyAlarmComponent } from "./containers/enterprise-hierarchy/enterprise-hierarchy.alarm.component";
import { FabricJSAlarmComponent } from "./containers/fabric-js/fabric-js.alarm.component";
import { MessageAlarmComponent } from "./containers/message/message.alarm.component";
import { PaintComponent } from "./component/paint/paint.component";
import { FabricCanvasComponent } from "./component/paint/fabric-canvas/fabric-canvas.component";
import { GraphicalToolbarComponent } from "./component/paint/toolbar/toolbar.component";
import { ColourPaletteComponent } from "./component/paint/toolbar/colour-palette/colour-palette.component";
import { ThicknessSliderComponent } from "./component/paint/toolbar/thickness-slider/thickness-slider.component";
import { EventHandlerService } from "./component/paint/event-handler.service";
import { FabricShapeService } from "./component/paint/shape.service";
import { StorageService } from "./service/storage.service";

//translate
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { BrowserModule } from "@angular/platform-browser";
import { SettingsAlarmComponent } from "./containers/settings/settings.alarm.component";
import { DevicesAlarmComponent } from "./containers/devices/devices.alarm.component";
import { DeviceMergeAlarmComponent } from "./containers/device-merge/device-merge.alarm.component";
import { ImportDevicesAlarmComponent } from "./containers/import-devices/import-devices.alarm.component";
import { AlarmTestAlarmComponent } from "./containers/alarm-test/alarm-test.alarm.component";
import { AlarmViewComponent } from "./containers/alarm-view/alarm-view.component";
import { AlarmMergeComponent } from "./containers/alarm-merge/alarm-merge.component";
import { GuardControlAlarmComponent } from "./containers/guard-control/guard-control.alarm.component";
import { PatientMedicationsAlarmComponent } from "./containers/patient-medications/patient-medications.alarm.component";
import { PopupQRCodeComponent } from './containers/popup-qrcode/popup-qrcode.component';
// import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    // ui components
    AlarmHeaderComponent,
    AlarmSidebarComponent,

    // Dialogs
    // Screens
    EnterpriseHierarchyAlarmComponent,
    HomeAlarmComponent,
    AccessControlAlarmComponent,
    GuardControlAlarmComponent,
    PatientMedicationsAlarmComponent,
    AlarmComponent,
    UsersAlarmComponent,
    RolesAlarmComponent,
    UserMergeAlarmComponent,
    RoleMergeAlarmComponent,
    AccessControlSettingsAlarmComponent,
    EnterpriseAlarmComponent,
    EnterpriseMergeAlarmComponent,
    EnterpriseHierarchyNodeComponent,
    LocationAlarmComponent,
    LocationMergeAlarmComponent,
    ImportLdapUsersAlarmComponent,
    UserProfileAlarmDialog,
    PopupCommonComponent,
    UserTeamAlarmComponent,
    UserTeamMergeAlarmComponent,
    PasswordPolicyComponent,
    FilterPipe,
    PointofcareAlarmComponent,
    PointofcareMergeAlarmComponent,
    ApplicationAlarmComponent,
    ApplicationMergeAlarmComponent,

    FabricJSAlarmComponent,
    MessageAlarmComponent,

    PaintComponent,
    FabricCanvasComponent,
    GraphicalToolbarComponent,
    ColourPaletteComponent,
    ThicknessSliderComponent,
    SettingsAlarmComponent,
    DevicesAlarmComponent,
    DeviceMergeAlarmComponent,
    ImportDevicesAlarmComponent,
    AlarmTestAlarmComponent,
    AlarmViewComponent,
    AlarmMergeComponent,
    PopupQRCodeComponent,
  ],
  imports: [
    SharedModule,
    AlarmRoutingModule,
    DragDropModule,
    MatToolbarModule,
    TreeModule,
    QRCodeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    HttpClientHelper,
    MatMomentDateModule,
    MatTooltipModule,
    MatToolbarModule,
    EventHandlerService,
    FabricShapeService,
    StorageService
  ],
  entryComponents: [UserProfileAlarmDialog, PopupCommonComponent]
})
export class AlarmModule {}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
