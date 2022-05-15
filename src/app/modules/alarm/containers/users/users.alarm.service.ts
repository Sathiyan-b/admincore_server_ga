import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { UserModel } from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UsersAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getUsers(_user: UserModel) {
    return this.httpClient.get(
      `${this.SERVER_URL}/user/all?is_active=${_user.is_active}&is_suspended=${_user.is_suspended}&user_type_id=${_user.user_type_id}`
    );
  }
  public getUsersById(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/user/${id}`);
  }
  public getLDAPUsers(request: ActionReq<any>) {
    // console.log("Request to LDAP Users: ", request);
    return this.httpClient.post(
      this.SERVER_URL + `/user/getLDAPUsers`,
      request
    );
  }
  public deleteUser(request: ActionReq<Array<UserModel>>) {
    return this.httpClient.put(this.SERVER_URL + `/user/deleteinbulk`, request);
  }
  public toggleSuspendUser(request: ActionReq<Array<UserModel>>) {
    return this.httpClient.put(
      this.SERVER_URL + `/user/togglesuspendinbulk`,
      request
    );
  }
}
