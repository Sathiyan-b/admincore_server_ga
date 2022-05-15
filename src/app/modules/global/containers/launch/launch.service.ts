import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { Auth } from "src/app/modules/alarm/models/auth.model";

@Injectable({
  providedIn: "root",
})
export class LaunchService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}

  public getAppSettings() {
    return this.httpClient.get(this.SERVER_URL + "/appsetting/all");
  }
}
