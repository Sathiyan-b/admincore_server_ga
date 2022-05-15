import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { Auth } from "src/app/modules/alarm/models/auth.model";
import { UserModel } from "src/app/modules/alarm/models/user.model";


@Injectable({
  providedIn: "root",
})
export class ResetPasswordService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}

  public getOTP(request: ActionReq<UserModel>) {
    return this.httpClient.post(
      this.SERVER_URL + "/auth/getotp",
      request,
      true
    );
  }
  public resetPassword(request: ActionReq<UserModel>) {
    return this.httpClient.post(
      this.SERVER_URL + "/auth/resetpasswordwithotp",
      request,
      true
    );
  }
  public changePassword(request: ActionReq<UserModel>) {
    return this.httpClient.post(this.SERVER_URL + `/user/changepassword`, request);
  }

  // public getUser()
  
}
