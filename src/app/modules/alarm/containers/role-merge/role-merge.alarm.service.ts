import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { RoleProfileModel } from "../../models/roleprofile.model";

@Injectable({
  providedIn: "root",
})
export class RoleMergeAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getPrivilegeList() {
    return this.httpClient.get(this.SERVER_URL + `/privilege/load`);
  }
  public getRoleProfileById(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/roleprofile/${id}`);
  }
  public getLDAPGroups(request: ActionReq<any>) {
    console.log("Request to LDAP: ", request);
    return this.httpClient.post(
      this.SERVER_URL + `/user/getLDAPGroups`,
      request
    );
  }
  public getAppSettings() {
    return this.httpClient.get(this.SERVER_URL + `/appsetting/all`);
  }
  public saveRoleProfileById(request: ActionReq<RoleProfileModel>) {
    if (request.item.id > 0) {
      return this.httpClient.put(this.SERVER_URL + `/roleprofile`, request);
    } else {
      return this.httpClient.post(this.SERVER_URL + `/roleprofile`, request);
    }
  }
  // async validator(
  //   _req: RoleProfileModel
  // ): Promise<Array<RoleProfileModel>> {
  //   var result: Array<RoleProfileModel> = [];
  //   try {
  //     var post_data: ActionReq<RoleProfileModel> =
  //       new ActionReq<RoleProfileModel>({
  //         item: _req,
  //       });
  //     var resp: any = await this.httpClient
  //       .post(this.SERVER_URL + "/roleprofile/validator", post_data)
  //       .toPromise();
  //     if (resp.item) result = resp.item;
  //   } catch (error) {
  //     throw error;
  //   }
  //   return result;
  // }
  async validator(_req: RoleProfileModel): Promise<Array<RoleProfileModel>> {
    var result: Array<RoleProfileModel> = [];
    try {
      var post_data: ActionReq<RoleProfileModel> =
        new ActionReq<RoleProfileModel>({
          item: _req,
        });
      var resp: any = await this.httpClient
        .post(this.SERVER_URL + "/roleprofile/validator", post_data)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {
      throw error;
    }
    return result;
  }
}
