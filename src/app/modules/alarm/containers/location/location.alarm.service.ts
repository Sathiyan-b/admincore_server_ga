import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class LocationAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getLocations() {
    return this.httpClient.get(this.SERVER_URL + "/location/");
  }
  public getLocationById(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/location/${id}`);
  }
}
