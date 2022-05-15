import { Injectable } from "@angular/core";
import { UserModel } from "../../models/user.model";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import { PointofcareModel } from "../../models/pointofcare.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";

@Injectable({
  providedIn: "root",
})
export class PointofcareMergeAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  _user: any = UserModel;

  public getUsers() {
    return this.httpClient.get(`${this.SERVER_URL}/user/all`);
  }

  public savePointofcare(request: ActionReq<PointofcareModel>) {
    if (request.item.id == 0) {
      return this.httpClient.post(
        `${this.SERVER_URL}/pointofcare/`,
        request
      );
    } else {
      return this.httpClient.put(
        `${this.SERVER_URL}/pointofcare/`,
        request
      );
    }
  }
  public getUserTeam() {
    return this.httpClient.get(`${this.SERVER_URL}/userteam/`);
  }
  public getReferenceList(type: String) {
    return this.httpClient.get(this.SERVER_URL + `/reference/${type}`);
  }
  public getPointofcareById(id: number) {
    var request: ActionReq<PointofcareModel> = new ActionReq<PointofcareModel>({
      item: new PointofcareModel({
        id,
      }),
    });
    return this.httpClient.post(
      `${this.SERVER_URL}/pointofcare/pocget`,
      request
    );
  }
  public getPointOfCareList() {
    return this.httpClient.get(
      `${this.SERVER_URL}/enthierarchy/getPointOfCare`,
    );
  }
}
