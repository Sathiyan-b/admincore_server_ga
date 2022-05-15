import { Injectable } from "@angular/core";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import { Devices } from "../../models/devices.model";
import { ReferenceListModel } from '../../models/referencelist.model';

@Injectable({
  providedIn: "root",
})
export class DeviceMergeAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getdevice(request: ActionReq<Devices>) {
    return this.httpClient.post(this.SERVER_URL + `/devices/get`, request);
  }
  public updateDevice(request: ActionReq<Devices>) {
    return this.httpClient.put(this.SERVER_URL + `/devices`, request);
  }
  public createDevice(request: ActionReq<Array<Devices>>) {
    return this.httpClient.post(this.SERVER_URL + `/devices/createinbulk`, request);
  }
  public getReferenceList(request: ActionReq<ReferenceListModel>) {
    return this.httpClient.post(this.SERVER_URL + `/reference/get`, request);
  }
}
