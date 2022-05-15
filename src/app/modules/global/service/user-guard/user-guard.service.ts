import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { PrivilegePermissions } from "../../model/permission.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class UserGuardService implements CanActivate {
  constructor(public router: Router, public authservice: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log("route   - ",route);
    var result: boolean = false;
    if (
      route != null &&
      route.data != null &&
      route.data.is_factory == false &&
      route.data.permission_list != null
    ) {
      var permission_list: Array<PrivilegePermissions.PERMISSIONS> =
        route.data.permission_list;
      var mode: PrivilegePermissions.PERMISSION_CHECK_MODE =
        route != null && route.data != null && route.data.mode != null
          ? route.data.mode
          : PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY;
      result = this.authservice.matchPermissions(permission_list, mode);
      if (result == false) {
        this.router.navigate(["/accessdenied"]);
      }
    } else {
      result = true;
    }
    return result;
  }
}