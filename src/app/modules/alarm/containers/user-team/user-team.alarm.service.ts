import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import { UserTeamModel } from "../../models/userteam.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";

@Injectable({
  providedIn: "root",
})
export class UserTeamAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getUserTeam(_userteam: UserTeamModel) {
    console.log("inside getUserTeam");
    return this.httpClient.get(
      `${this.SERVER_URL}/userteam/userall?is_active=${_userteam.is_active}`
    );
  }
  public deleteUserTeam(request: ActionReq<Array<UserTeamModel>>) {
    return this.httpClient.put(
      this.SERVER_URL + `/userteam/deleteinbulk`,
      request
    );
  }
  public toggleSuspendUserTeam(request: ActionReq<Array<UserTeamModel>>) {
    return this.httpClient.put(
      this.SERVER_URL + `/userteam/togglesuspendinbulk`,
      request
    );
  }
  async validator(_req: UserTeamModel): Promise<Array<UserTeamModel>> {
    var result: Array<UserTeamModel> = [];
    try {
      var post_data: ActionReq<UserTeamModel> = new ActionReq<UserTeamModel>({
        item: _req,
      });
      var resp: any = await this.httpClient
        .post(this.SERVER_URL + "/userteam/validator", post_data)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {
      throw error;
    }
    return result;
  }
}
