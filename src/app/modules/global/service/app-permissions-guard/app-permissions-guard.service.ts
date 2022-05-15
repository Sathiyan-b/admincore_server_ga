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
@Injectable({
  providedIn: "root",
})
export class AppPermissionsGuardService implements CanActivate, CanLoad {
  constructor(public router: Router, private global_service: GlobalService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;
    return this.checkPermission(url);
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    let url = _.reduce(
      segments,
      (path, current_segment, index) => {
        return `${path}/${current_segment.path}`;
      },
      ""
    );
    return this.checkPermission(url);
  }
  checkPermission(url) {
    var permissions: any = this.global_service.permission_object;
    var can_load = true;
    switch (url) {
      case "/alarm/accesscontrol":
        // can_load = permissions.user.view;
        can_load = permissions.user.view || permissions.roleprofile.view;
        if (!can_load) this.router.navigateByUrl("/alarm/enterprise");
        break;
      default:
        break;
    }
    return can_load;
  }
}
