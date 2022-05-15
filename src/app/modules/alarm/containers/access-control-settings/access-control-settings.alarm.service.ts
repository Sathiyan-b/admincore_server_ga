import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import {AppSettingsModel} from "../../models/appsettings.model";

@Injectable({
  providedIn: "root"
})
export class AccessControlSettingsAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getAppSettings() {
    return this.httpClient.get(this.SERVER_URL + `/appsetting/all`);
  }
  public saveAppSettings(request: ActionReq<AppSettingsModel>) {
    if (request.item.id == 0) {
      return this.httpClient.post(this.SERVER_URL + `/appsetting`, request);
    } else {
      return this.httpClient.put(this.SERVER_URL + `/appsetting`, request);
    }
  }
}
