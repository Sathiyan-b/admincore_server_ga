import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { UserModel } from "src/app/modules/alarm/models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserPasswordAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}

  public changePassword(request: ActionReq<UserModel>) {
    return this.httpClient.post(this.SERVER_URL + `/user/changepassword`, request);
  }
 

}
