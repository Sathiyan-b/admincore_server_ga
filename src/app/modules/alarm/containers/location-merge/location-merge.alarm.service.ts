import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import {LocationModel} from "../../models/location.model";

@Injectable({
  providedIn: "root"
})
export class LocationMergeAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getLocationsById(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/location/${id}`);
  }
  public getLocalities() {
    return this.httpClient.get(this.SERVER_URL + `/reference/localities`);
  }
  public loadEnterprises() {
    return this.httpClient.get(this.SERVER_URL + `/enterprise/load`);
  }
  public saveLocation(request: ActionReq<LocationModel>) {
    if (request.item.id > 0) {
      return this.httpClient.put(this.SERVER_URL + `/location`, request);
    } else {
      return this.httpClient.post(this.SERVER_URL + `/location`, request);
    }
  }
}
