import { Injectable } from "@angular/core";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import { UserMergeUserModel } from "../user-merge/usermergeuser.model";

@Injectable({
  providedIn: "root",
})
export class ImportDevicesAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public createDeviceInBulk(request: ActionReq<Array<UserMergeUserModel>>) {
    return this.httpClient.post(
      this.SERVER_URL + `/devices/createinbulk`,
      request
    );
  }
}
