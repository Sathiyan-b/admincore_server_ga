import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { Devices } from "../../models/devices.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";

@Injectable({
  providedIn: "root"
})
export class DevicesAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getdeviceList(request: ActionReq<Devices>) {
    return this.httpClient.post(this.SERVER_URL + `/devices/get`, request);
  }
  //   public saveAppSettings(request: ActionReq<AppSettingsModel>) {
  //     if (request.item.id == 0) {
  //       return this.httpClient.post(this.SERVER_URL + `/appsetting`, request);
  //     } else {
  //       return this.httpClient.put(this.SERVER_URL + `/appsetting`, request);
  //     }
  //   }
  public deleteDevice(request: ActionReq<Devices>) {
    return this.httpClient.put(
      this.SERVER_URL + `/devices/deleteinbulk`,
      request
    );
  }
  public toggleSuspendDevice(request: ActionReq<Devices>) {
    return this.httpClient.put(
      this.SERVER_URL + `/devices/togglesuspendinbulk`,
      request
    );
  }
}
