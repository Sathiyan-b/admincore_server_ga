import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import {EnterpriseModel} from "../../models/enterprise.model";

@Injectable({
  providedIn: "root"
})
export class EnterpriseMergeAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getEnterprisesById(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/enterprise/${id}`);
  }
  public getLocalities() {
    return this.httpClient.get(this.SERVER_URL + `/reference/localities`);
  }
  public saveEnterprise(request: ActionReq<EnterpriseModel>) {
    if (request.item.id > 0) {
      return this.httpClient.put(this.SERVER_URL + `/enterprise`, request);
    } else {
      return this.httpClient.post(this.SERVER_URL + `/enterprise`, request);
    }
  }
}
