import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import ActionReq from "../../global/model/actionreq.model";
import { HttpClientHelper } from "../../global/service/helpers/HttpClientHelper";
import { ReferenceListModel } from "../models/referencelist.model";

@Injectable({
  providedIn: "root",
})
export class ReferenceListService {
  BASE_URL: string;
  constructor(private http: HttpClientHelper) {
    this.BASE_URL = environment.alarm_base_url + "/reference";
  }
  async get(_req: ReferenceListModel): Promise<Array<ReferenceListModel>> {
    var result: Array<ReferenceListModel> = [];
    try {
      var post_data: ActionReq<ReferenceListModel> = new ActionReq<ReferenceListModel>({
        item: _req,
      });
      var resp: any = await this.http
        .post(this.BASE_URL + "/get", post_data)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {
      throw error;
    }
    return result;
  }
  async insert(_req: ReferenceListModel): Promise<ReferenceListModel> {
    var result: ReferenceListModel = new ReferenceListModel();
    try {
      var post_data: ActionReq<ReferenceListModel> = new ActionReq<ReferenceListModel>({
        item: _req,
      });
      var resp: any = await this.http
        .post(this.BASE_URL + "/insert", post_data)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {
      throw error;
    }
    return result;
  }
  async update(_req: ReferenceListModel): Promise<ReferenceListModel> {
    var result: ReferenceListModel = new ReferenceListModel();
    try {
      var post_data: ActionReq<ReferenceListModel> = new ActionReq<ReferenceListModel>({
        item: _req,
      });
      var resp: any = await this.http
        .post(this.BASE_URL + "/update", post_data)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {
      throw error;
    }
    return result;
  }
}
