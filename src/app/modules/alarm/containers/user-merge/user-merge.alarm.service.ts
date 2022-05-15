import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { UserModel } from "../../models/user.model";
import { UserMergeUserModel } from "./usermergeuser.model";

@Injectable({
  providedIn: "root",
})
export class UserMergeAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getUsersById(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/user/${id}`);
  }

  public async validator(
    req: ActionReq<UserMergeUserModel>
  ): Promise<Array<UserMergeUserModel>> {
    var result: Array<UserMergeUserModel> = [];

    try {
      var resp: any = await this.httpClient
        .post(this.SERVER_URL + "/user/validator", req)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {
      throw error;
    }
    return result;
  }

  public getReferenceList(type: String) {
    return this.httpClient.get(this.SERVER_URL + `/reference/${type}`);
  }
  public getLDAPUserData(request: ActionReq<any>) {
    return this.httpClient.post(
      this.SERVER_URL + `/user/getLDAPGroupsForLDAPUser`,
      request
    );
  }
  public getRoleProfiles() {
    return this.httpClient.get(this.SERVER_URL + `/roleprofile/load`);
  }
  public saveUser(request: ActionReq<UserModel>) {
    if (request.item.id > 0) {
      return this.httpClient.put(this.SERVER_URL + `/user`, request);
    } else {
      return this.httpClient.post(this.SERVER_URL + `/user`, request);
    }
  }
  public getActiveDirectoryCredentials(active_directory_root: string) {
    return this.httpClient.get(
      this.SERVER_URL + `/appsetting/getADCredentials/` + active_directory_root
    );
  }
  public loadEnterprises() {
    return this.httpClient.get(this.SERVER_URL + `/enterprise/load`);
  }
  public loadLocations() {
    return this.httpClient.get(this.SERVER_URL + `/location/load`);
  }
  public loadLanguages() {
    return this.httpClient.get(this.SERVER_URL + `/appsetting/`);
  }
}
