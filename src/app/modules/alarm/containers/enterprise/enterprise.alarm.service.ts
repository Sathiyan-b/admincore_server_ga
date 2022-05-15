import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from '../../../global/model/actionreq.model';
import {EnterpriseModel} from '../../models/enterprise.model';

@Injectable({
  providedIn: "root"
})
export class EnterpriseAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getEnterprises() {
    return this.httpClient.get(this.SERVER_URL + "/enterprise/");
  }
  public getEnterpriseById(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/enterprise/${id}`);
  }
  public deleteEnterpriseById(id: number) {
    //return this.httpClient.get(this.SERVER_URL + `/enterprise/${id}`);
  }
  public updateImage(request: ActionReq<EnterpriseModel>) {
    return this.httpClient.post(this.SERVER_URL + `/enterprise/updateImage`, request);
  }
}
