import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { UserModel } from "../../models/user.model";
import { FileManagerModel } from "../../models/filemanager.model";

@Injectable({
  providedIn: "root",
})
export class UserprofileAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) { }

  public changePassword(request: ActionReq<UserModel>) {
    return this.httpClient.post(this.SERVER_URL + `/user/changepassword`, request);
  }
  public updateImage(request: ActionReq<UserModel>) {
    return this.httpClient.post(this.SERVER_URL + `/user/updateImage`, request);
  }

  public insertFileManager(request: ActionReq<FileManagerModel>) {
    return this.httpClient.post(this.SERVER_URL + `/filemanager`, request);
  }
  public updateFileManager(request: ActionReq<FileManagerModel>) {
    return this.httpClient.put(this.SERVER_URL + `/filemanager`, request);
  }
  public getFileManager(id: number) {
    return this.httpClient.get(this.SERVER_URL + `/filemanager/${id}`);
  }

  

}
