import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment,
} from "@angular/router";
import { GlobalService } from "../shared/global.service";
import * as _ from "lodash";
import { Location } from "@angular/common";
@Injectable({
  providedIn: "root",
})
export class AppSettingsGuardService implements CanActivate, CanLoad {
  constructor(
    public router: Router,
    private global_service: GlobalService,
    private location: Location
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;
    return this.checkSettings(url);
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    let url =
      this.location.path() != ""
        ? this.location.path()
        : this.global_service.redirect_url;
    return this.checkSettings(url);
  }
  checkSettings(url) {
    var app_settings = this.global_service.app_settings;
    if (_.get(app_settings, "auth_mode", "").length == 0) {
      this.global_service.redirect_url = url;
      this.router.navigateByUrl("/launch");
      return false;
    }
    return true;
  }
}
