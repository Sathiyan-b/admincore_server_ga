import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import ActionReq from "../../global/model/actionreq.model";
import { HttpClientHelper } from "../../global/service/helpers/HttpClientHelper";
import { Application, ApplicationWrapper } from "../models/application.model";

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  BASE_URL: string;
  constructor(private http: HttpClientHelper) {
    this.BASE_URL = environment.alarm_base_url + "/application";
  }
  async get(_req: ApplicationWrapper): Promise<Array<ApplicationWrapper>> {
    var result: Array<ApplicationWrapper> = [];
    try {
      var post_data: ActionReq<Application> = new ActionReq<Application>({
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
  async getSecret(
    _req: ApplicationWrapper
  ): Promise<Array<ApplicationWrapper>> {
    var result: Array<ApplicationWrapper> = [];
    try {
      var post_data: ActionReq<Application> = new ActionReq<Application>({
        item: _req,
      });
      var resp: any = await this.http
        .post(this.BASE_URL + "/getsecret", post_data)
        .toPromise();
      if (resp.item) result = resp.item;
    } catch (error) {
      throw error;
    }
    return result;
  }
  async insert(_req: Application): Promise<Application> {
    var result: Application = new Application();
    try {
      var post_data: ActionReq<Application> = new ActionReq<Application>({
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
  async update(_req: Application): Promise<Application> {
    var result: Application = new Application();
    try {
      var post_data: ActionReq<Application> = new ActionReq<Application>({
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
  async generateAppKey(_req: Application): Promise<Application> {
    var result: Application = new Application();
    try {
      var post_data: ActionReq<Application> = new ActionReq<Application>({
        item: _req,
      });
      var resp: any = await this.http
        .post(this.BASE_URL + "/generateAppKey", post_data)
        .toPromise();
      if (resp.item) result = resp.item[0];
    } catch (error) {
      throw error;
    }
    return result;
  }
}
