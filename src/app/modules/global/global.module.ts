// angular components
import { DataTablesModule } from "angular-datatables";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// ui
import { BreadcrumbComponent } from "./containers/breadcrumb/breadcrumb.component";
import { LoginComponent } from "./containers/login/login.component";
import { PagenotfoundComponent } from "./containers/pagenotfound/pagenotfound.component";
import { UserPasswordComponent } from "./containers/password/password.component";

// third party components
import { JwtModule } from "@auth0/angular-jwt";
import { AngularSlickgridModule } from "angular-slickgrid";
import { ToastrModule } from "ngx-toastr";
import { NgSelectModule } from "@ng-select/ng-select";
import { ChartsModule } from "ng2-charts";

// material
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTabsModule, MatTabLink } from "@angular/material/tabs";
import { MatTreeModule } from "@angular/material/tree";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDividerModule } from "@angular/material/divider";
import { ResetPasswordComponent } from "./containers/reset-password/reset-password.component";
import { LaunchComponent } from "./containers/launch/launch.component";
import { GlobalService } from "./service/shared/global.service";
import { MatRippleModule } from "@angular/material/core";
//translate
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
// Directives
import { CustomValidatorDirective } from "./directives/custom-validator.directive";
import { ApplicationAsyncValidatorDirective } from "./directives/application-async-validator.directive";
import { UserEmailAsyncValidatorDirective } from "./directives/user-email-async-validator.directive";
import { UserLoginIDAsyncValidatorDirective } from "./directives/user-loginid-async-validator.directive";
import { RoleProfileNameAsyncValidatorDirective } from "./directives/role-profile-async-validator.directive";
import { UserTeamNameAsyncValidatorDirective } from "./directives/user-team-name-async-validator.directive";
import { IconModule } from "./service/icon.module";
import { PopUpCommonComponent } from './containers/pop-up-common/pop-up-common.component';

@NgModule({
  imports: [
    // angular components
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    // third party components
    NgSelectModule,
    // material
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    MatCardModule,
    MatBadgeModule,
    MatDividerModule,
    ChartsModule,
    MatRippleModule,
    MatIconModule,
    IconModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    // directive
    // CustomValidatorDirective
  ],
  declarations: [
    // uicomponents
    BreadcrumbComponent,
    // Dialogs
    // Screens
    LoginComponent,
    PagenotfoundComponent,
    ResetPasswordComponent,
    LaunchComponent,
    UserPasswordComponent,
    // directive
    CustomValidatorDirective,
    ApplicationAsyncValidatorDirective,
    UserEmailAsyncValidatorDirective,
    UserLoginIDAsyncValidatorDirective,
    RoleProfileNameAsyncValidatorDirective,
    UserTeamNameAsyncValidatorDirective,
    PopUpCommonComponent,
  ],
  exports: [
    // angular components
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    AngularSlickgridModule,
    HttpClientModule,
    // third party components
    AngularSlickgridModule,
    NgSelectModule,
    // material
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    MatCardModule,
    MatBadgeModule,
    MatDividerModule,
    ChartsModule,
    MatRippleModule,
    MatIconModule,
    IconModule,
    // uicomponents
    BreadcrumbComponent,
    // Dialogs

    // Screens
    LoginComponent,
    PagenotfoundComponent,
    LaunchComponent,
    ResetPasswordComponent,
    // directive
    CustomValidatorDirective,
    ApplicationAsyncValidatorDirective,
    UserEmailAsyncValidatorDirective,
    UserLoginIDAsyncValidatorDirective,
    RoleProfileNameAsyncValidatorDirective,
    UserTeamNameAsyncValidatorDirective,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [GlobalService],
    };
  }
}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
