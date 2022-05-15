import { Injectable } from "@angular/core";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import { SettingsModel } from "../../models/settings.model";

@Injectable({
  providedIn: "root",
})
export class SettingAlarmService {
  private SERVER_URL = environment.alarm_base_url;

  constructor(private HttpClient: HttpClientHelper) {}

  public getDateTmeFormat(req: string) {
    return this.HttpClient.get(this.SERVER_URL + `/reference/${req}`);
  }

  public getglobaldata(req: ActionReq<SettingsModel>) {
    return this.HttpClient.post(
      this.SERVER_URL + `/appsetting/getappsetting`,
      req
    );
  }

  public saveglobaldata(req: ActionReq<SettingsModel>) {
    if (req.item.id == 0) {
      return this.HttpClient.post(
        this.SERVER_URL + `/appsetting/insertsettings`,
        req
      );
    } else {
      return this.HttpClient.post(
        this.SERVER_URL + `/appsetting/updatesettings`,
        req
      );
    }
  }
  public getEnvSettings() {
    return this.HttpClient.get(this.SERVER_URL + `/appsetting/`);
  }
  public getTagsAndColorList() {
    return this.HttpClient.get(
      this.SERVER_URL + `/appsetting/getTagsAndColorList`
    );
  }
}
