import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "../../../global/model/actionreq.model";
import {
  EnterpriseHierarchyListModel,
  EnterpriseModel,
} from "../../models/enterprise.model";
import { EntHierarchyCriteria } from "../../models/enthierarchy.model";
import { PointofcareModel } from "../../models/pointofcare.model";

@Injectable({
  providedIn: "root",
})
export class EnterpriseHierarchyAlarmService {
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
  async getEnterpriseHierarchyList(): Promise<
    Array<EnterpriseHierarchyListModel>
  > {
    var result: Array<EnterpriseHierarchyListModel> = [];
    try {
      var resp: any = await this.httpClient
        .get(this.SERVER_URL + `/enterprise/enterpriseHierarchyList`)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {}
    return result;
  }
  async getMapData(req: PointofcareModel): Promise<Array<PointofcareModel>> {
    var result: Array<PointofcareModel> = [];
    try {
      var request = new ActionReq<PointofcareModel>({
        item: req,
      });
      var resp: any = await this.httpClient
        .post(this.SERVER_URL + `/pointofcare/getMapdata`, request)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {}
    return result;
  }
  async updateMapData(req: PointofcareModel): Promise<Array<PointofcareModel>> {
    var result: Array<PointofcareModel> = [];
    try {
      var request = new ActionReq<PointofcareModel>({
        item: req,
      });
      var resp: any = await this.httpClient
        .post(this.SERVER_URL + `/pointofcare/updateMapData`, request)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {}
    return result;
  }
}
