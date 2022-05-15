import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { UserModel } from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class ImportLdapUsersAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getAppSettings() {
    return this.httpClient.get(this.SERVER_URL + `/appsetting/all`);
  }
  public getReferenceList(type: String) {
    return this.httpClient.get(this.SERVER_URL + `/reference/${type}`);
  }
  public getLDAPUsers(request: ActionReq<any>) {
    // console.log("Request to LDAP Users: ", request);
    return this.httpClient.post(
      this.SERVER_URL + `/user/getLDAPUsers`,
      request
    );
  }
  //   public getAppSettings() {
  //     return this.httpClient.get(this.SERVER_URL + `/appsetting/all`);
  //   }
  public saveUsers(request: ActionReq<Array<UserModel>>) {
    return this.httpClient.post(
      this.SERVER_URL + `/user/createinbulk`,
      request
    );
  }
  public getUsers(_user: UserModel) {
    return this.httpClient.get(
      `${this.SERVER_URL}/user/all?user_type=${_user.user_type_id}`
    );
  }
}
