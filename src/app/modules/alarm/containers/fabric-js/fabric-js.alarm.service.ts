import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "../../../global/model/actionreq.model";
import { EnterpriseModel } from "../../models/enterprise.model";
import { EntHierarchyCriteria } from "../../models/enthierarchy.model";

@Injectable({
  providedIn: "root",
})
export class FabricJSAlarmService {
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
    return this.httpClient.post(
      this.SERVER_URL + `/enterprise/updateImage`,
      request
    );
  }
  async getRoomsAndBeds(): Promise<Array<EntHierarchyCriteria>> {
    var result: Array<EntHierarchyCriteria> = [];
    try {
      var request = {
        item: {
          identifier: "E-SH->W-NICU",
          ent_type: "Enterprise",
          multilevel: true,
        },
      };
      var resp: any = await this.httpClient
        .post(this.SERVER_URL + `/enthierarchy/getChildren`, request)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {}
    return result;
  }
}
