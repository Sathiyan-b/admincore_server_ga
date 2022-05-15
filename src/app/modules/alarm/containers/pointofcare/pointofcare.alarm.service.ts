import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import { PointofcareModel } from "../../models/pointofcare.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";

@Injectable({
  providedIn: "root",
})
export class PointofcareAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getPointofcare(request: ActionReq<PointofcareModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/pointofcare/pocget`,
      request
    );
  }
  public deletePointofcare(request: ActionReq<Array<PointofcareModel>>) {
    return this.httpClient.put(
      this.SERVER_URL + `/pointofcare/deleteinbulk`,
      request
    );
  }
}
