import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import ActionReq from "../../global/model/actionreq.model";
import { HttpClientHelper } from "../../global/service/helpers/HttpClientHelper";
import { PasswordPolicyModel } from "../models/passwordpolicy.model";

@Injectable({
  providedIn: "root",
})
export class PasswordPolicyService {
  BASE_URL: string;
  constructor(private http: HttpClientHelper) {
    this.BASE_URL = environment.alarm_base_url + "/passwordpolicy";
  }
  async get(): Promise<PasswordPolicyModel> {
    var result: PasswordPolicyModel = new PasswordPolicyModel();
    try {
      var resp: any = await this.http.get(this.BASE_URL).toPromise();
      if (resp.item && resp.item.length > 0) result = resp.item[0];
    } catch (error) {
      throw error;
    }
    return result;
  }
}
