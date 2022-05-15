import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { RoleProfileModel } from "../../models/roleprofile.model";

@Injectable({
  providedIn: "root",
})
export class RolesAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getRoleProfiles(_role: RoleProfileModel) {
    return this.httpClient.get(
      this.SERVER_URL + "/roleprofile/all?is_active=" + _role.is_active
    );
  }
  public deleteRole(request: ActionReq<Array<RoleProfileModel>>) {
    return this.httpClient.put(
      this.SERVER_URL + `/roleprofile/deleteinbulk`,
      request
    );
  }
  public toggleSuspendRole(request: ActionReq<Array<RoleProfileModel>>) {
    return this.httpClient.put(
      this.SERVER_URL + `/roleprofile/togglesuspendinbulk`,
      request
    );
  }
}
