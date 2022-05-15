import { Base } from "../../global/model/base.model";
import * as _ from "lodash";
import { PrivilegeModel } from "./privilege.model";

export class UserSessionModel extends Base {
  id: number = 0;
  refresh_token: string = "";
  user_id: number = 0;
  start_time: Date | null = null;
  end_time: Date | null = null;
  last_active: Date | null = null;
  is_expired: boolean = false;
  killed_by: number = 0;
  push_notification_token: string = "";
  /* template */
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date | null = null;
  modified_on: Date | null = null;
  is_active: boolean = true;
  app_id: number = 0;

  constructor(init?: Partial<UserSessionModel>) {
    super(init);
    if (init) {
      if (typeof init.id == "number") this.id = init.id;
      if (typeof init.killed_by == "number") this.killed_by = init.killed_by;
      if (typeof init.refresh_token == "string")
        this.refresh_token = init.refresh_token;
      if (typeof init.user_id == "number") this.user_id = init.user_id;
      if (
        init.start_time instanceof Date ||
        typeof init.start_time == "string"
      )
        this.start_time = new Date(init.start_time);
      if (init.end_time instanceof Date || typeof init.end_time == "string")
        this.end_time = new Date(init.end_time);
      if (
        init.last_active instanceof Date ||
        typeof init.last_active == "string"
      )
        this.last_active = new Date(init.last_active);
      if (typeof init.is_expired == "boolean")
        this.is_expired = init.is_expired;
      if (typeof init.created_by == "number")
        this.created_by = init.created_by;
      if (typeof init.modified_by == "number")
        this.modified_by = init.modified_by;
      if (typeof init.is_active == "boolean") this.is_active = init.is_active;
      if (
        init.created_on instanceof Date ||
        typeof init.created_on == "string"
      )
        this.created_on = new Date(init.created_on);
      if (
        init.modified_on instanceof Date ||
        typeof init.modified_on == "string"
      )
        this.modified_on = new Date(init.modified_on);
      if (typeof init.push_notification_token == "string")
        this.push_notification_token = init.push_notification_token;
      if (_.get(init, "app_id", null) != null) {
        this.app_id = parseInt(_.get(init, "app_id", 0).toString());
      }
    }
  }
}
