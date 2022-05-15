import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { HttpClientHelper } from "../helpers/HttpClientHelper";
import ActionReq from "../../model/actionreq.model";
import { Auth } from "src/app/modules/alarm/models/auth.model";
import { switchMap } from "rxjs/operators";

import { throwError, of } from "rxjs";

import ActionRes from "../../model/actionres.model";
import * as _ from "lodash";
import ErrorResponse from "../../model/errorres.model";
import { PrivilegePermissions } from "../../model/permission.model";
import { PrivilegeModel } from "src/app/modules/alarm/models/privilege.model";
import { StorageService } from "src/app/modules/alarm/service/storage.service";
import { GlobalService } from "../shared/global.service";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(
    public jwtHelper: JwtHelperService,
    public router: Router,
    private httpClient: HttpClientHelper,
    public storageService: StorageService,
    private global_service: GlobalService
  ) {}

  redirect_url = "/alarm";
  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (token !== null) {
      try {
        return !this.jwtHelper.isTokenExpired(token);
      } catch (error) {
        return false;
      }
    } else return false;
  }
  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }
  public login(request: ActionReq<Auth>, is_external_app: boolean) {
    var endpoint = "/auth/login";
    if (is_external_app) endpoint = "/auth/signin";
    return this.httpClient.post(this.SERVER_URL + endpoint, request, true);
  }
  public refreshAccessToken() {
    var refresh_token = localStorage.getItem("refresh_token");
    var request = new ActionReq<Auth>({
      item: new Auth({
        refresh_token,
      }),
    });
    return this.httpClient
      .post(this.SERVER_URL + "/auth/token", request, true)
      .pipe(
        switchMap((resp: ActionRes<Auth>) => {
          if (_.get(resp, "item.refresh_token", "") == "") {
            throwError(
              new ErrorResponse({
                message: "Error refreshing token",
              })
            );
          }
          localStorage.setItem("token", resp.item.token);
          // this.storageService.permission_map_list = resp.item.user.privileges;
          return of(resp.item.refresh_token);
        })
      );
  }
  getAccessToken() {
    var token = localStorage.getItem("token");
    return token;
  }
  matchPermissions(
    requested_privilege_list: Array<PrivilegePermissions.PERMISSIONS>,
    mode: PrivilegePermissions.PERMISSION_CHECK_MODE
  ) {
    var result: boolean = false;
    try {
      var user_privilege_list: Array<PrivilegeModel> =
        this.global_service.permission_map_list;
      var user_data = this.global_service.user_data;
      if (user_privilege_list.length > 0) {
        let privilege_key_list: Array<string> = _.map(
          user_privilege_list,
          (v) => {
            return v.identifier;
          }
        );
        switch (mode) {
          case PrivilegePermissions.PERMISSION_CHECK_MODE.SOME:
            result = _.some(requested_privilege_list, (v: any) => {
              return privilege_key_list.includes(v);
            });
            break;
          case PrivilegePermissions.PERMISSION_CHECK_MODE.EVERY:
            result = _.every(requested_privilege_list, (v: any) => {
              return privilege_key_list.includes(v);
            });
            break;
          default:
            break;
        }
      } else {
        if (user_data.is_factory) result = true;
      }
    } catch (e) {
      var error = e;
      throw error;
    }
    return result;
  }
}
