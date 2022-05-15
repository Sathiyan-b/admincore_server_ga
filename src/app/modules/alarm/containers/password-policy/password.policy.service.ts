import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { HttpClientHelper } from 'src/app/modules/global/service/helpers/HttpClientHelper';
import ActionReq from 'src/app/modules/global/model/actionreq.model';
import PasswordPolicyModel from '../../models/passwordpolicy.model';

@Injectable({
  providedIn: "root",
})
export class PasswordpolicyService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) { }

  public getPasswordPolicy() {
    return this.httpClient.get(this.SERVER_URL + `/passwordpolicy`);
  }
 
  public insertPasswordPolicy(request: ActionReq<PasswordPolicyModel>) {
    return this.httpClient.post(
      this.SERVER_URL + `/passwordpolicy`,
      request
    );
  }
  public updatePasswordPolicy(request: ActionReq<PasswordPolicyModel>) {
    return this.httpClient.put(
      this.SERVER_URL + `/passwordpolicy`,
      request
    );
  }
}
