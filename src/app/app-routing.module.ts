import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Screens
import { PagenotfoundComponent } from "./modules/global/containers/pagenotfound/pagenotfound.component";
import { LoginComponent } from "./modules/global/containers/login/login.component";
import { UserPasswordComponent } from "./modules/global/containers/password/password.component";
import { AuthGuardService } from "./modules/global/service/auth/auth-guard.service";
import { ResetPasswordComponent } from "./modules/global/containers/reset-password/reset-password.component";
import { LaunchComponent } from "./modules/global/containers/launch/launch.component";
import { GlobalService } from "./modules/global/service/shared/global.service";
import { AppSettingsGuardService } from './modules/global/service/app-settings-guard/app-settings-guard.service';
import { AccessDeniedComponent } from "./modules/global/containers/access-denied/access-denied.component";

const appRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AppSettingsGuardService],
  },
  { path: "launch", component: LaunchComponent },
  {
    path: "resetpassword",
    component: ResetPasswordComponent,
    canActivate: [AppSettingsGuardService],
  },
  {
    path: "changepassword",
    component: UserPasswordComponent,
    canActivate: [AppSettingsGuardService],
  },
  {
    path: "accessdenied",
    component: AccessDeniedComponent,
    canActivate: [AppSettingsGuardService],
  },
  { path: "", redirectTo: "alarm", pathMatch: "full" },
  {
    path: "alarm",
    loadChildren: () =>
      import("./modules/alarm/alarm.module").then((mod) => mod.AlarmModule),
    // data: { preload: true },
    canLoad: [AppSettingsGuardService,AuthGuardService],
  },
  { path: "**", component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
