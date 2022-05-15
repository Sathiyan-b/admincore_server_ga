import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { HttpClientHelper } from 'src/app/modules/global/service/helpers/HttpClientHelper';
import { environment } from 'src/environments/environment';
import { UserTeamModel } from '../../models/userteam.model';
import ActionReq from 'src/app/modules/global/model/actionreq.model';

@Injectable({
  providedIn: 'root'
})
export class UserTeamMergeAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) { }
  _user: any = UserModel;

  public getUsers() {
    return this.httpClient.get(
      `${this.SERVER_URL}/user/all`
    );
  }
  public getRole() {
    return this.httpClient.get(`${this.SERVER_URL}/reference/TEAM_ROLE`);
  }
  public postUserTeam(request: ActionReq<UserTeamModel>) {
    if (request.item.id == 0) {
      return this.httpClient.post(`${this.SERVER_URL}/userteam/`, request);
    } else {
      return this.httpClient.put(`${this.SERVER_URL}/userteam/`, request);
    }
  }
  public getUserTeam() {
    return this.httpClient.get(`${this.SERVER_URL}/userteam/`);
  }
  public getUserTeamById(id:number) {
    return this.httpClient.get(`${this.SERVER_URL}/userteam/userall?id= ${id}`);
  }
}
