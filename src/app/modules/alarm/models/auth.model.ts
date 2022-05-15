import * as _ from "lodash";
import { Base } from "../../global/model/base.model";
import { UserModel } from "./user.model";
import { UserSessionModel } from "./usersession.model";

export class Auth extends Base {
  login?: string;
  password?: string;
  token?: string;
  user?: UserModel;
  refresh_token?: string;
  push_notification_token?: string;
  session_id: number | null = null;
  session: UserSessionModel | null = null;
  app_key: string | null = null;

  constructor(init?: Partial<Auth>) {
    super(init);
    if (init) {
      if (_.get(init, "login", null) != null) this.login = init.login;
      if (_.get(init, "password", null) != null) this.password = init.password;
      if (_.get(init, "token", null) != null) this.token = init.token;
      if (_.get(init, "refresh_token", null) != null)
        this.refresh_token = init.refresh_token;
      if (_.get(init, "user", null) != null) {
        this.user = new UserModel(init.user);
      }
      if (typeof init.push_notification_token == "string") {
        this.push_notification_token = init.push_notification_token;
      }
      if (_.get(init, "app_key", null) != null)
        this.app_key = init.app_key;
    }
  }
}
