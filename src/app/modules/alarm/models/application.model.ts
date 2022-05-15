import { Base } from "../../global/model/base.model";
import * as _ from "lodash";
import { UserModel } from "./user.model";

export class Application extends Base {
  id: number = 0;
  app_type_id: number = 0;
  auth_type_id: number = 0;
  identifier: string = "";
  display_text: string = "";
  email: string = "";
  mobile_number: string = "";
  purpose: string = "";
  is_licensed: boolean = false;
  license_key: string | null = "";
  license_info: string = "";
  app_logo_id: number = 0;
  lang_code: string = "en-GB";
  enterprise_id: number = 0;
  ent_location_id: number = 0;
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date = new Date();
  modified_on: Date = new Date();
  is_active: boolean = true;
  is_suspended: boolean = false;
  parent_id: number = 0;
  is_factory: boolean = false;
  notes: string = "";
  app_key: string = "";
  success_callback: string = "";
  failure_callback: string = "";

  // LDAP configuration
  ad_url: string = "";
  ad_baseDN: string = "";
  ad_username: string = "";
  ad_password: string = "";

  root_username: string = "";
  root_password: string = "";
  root_confirmpassword: string = "";
  root_user_role: string = "";
  is_root_changed: boolean = false;
  root_userid: number = 0;
  first_name: string = "";


  constructor(init?: Partial<Application>) {
    super(init);
    if (init) {
      if (_.get(init, "id", null) != null) {
        this.id = parseInt(_.get(init, "id", 0).toString());
      }
      if (_.get(init, "auth_type_id", null) != null) {
        this.auth_type_id = parseInt(_.get(init, "auth_type_id", 0).toString());
      }
      if (_.get(init, "app_type_id", null) != null) {
        this.app_type_id = parseInt(_.get(init, "app_type_id", 0).toString());
      }
      this.identifier = _.get(init, "identifier", "");
      this.display_text = _.get(init, "display_text", "");
      this.email = _.get(init, "email", "");
      this.mobile_number = _.get(init, "mobile_number", "");
      this.purpose = _.get(init, "purpose", "");
      this.is_licensed = _.get(init, "is_licensed", false);
      this.license_key = _.get(init, "license_key", "");
      this.license_info = _.get(init, "license_info", "");
      this.first_name = _.get(init, "first_name", "");

      if (_.get(init, "app_logo_id", null) != null) {
        this.app_logo_id = parseInt(_.get(init, "app_logo_id", 0).toString());
      }
      if (_.get(init, "enterprise_id", null) != null) {
        this.enterprise_id = parseInt(
          _.get(init, "enterprise_id", 0).toString()
        );
      }
      if (_.get(init, "ent_location_id", null) != null) {
        this.ent_location_id = parseInt(
          _.get(init, "ent_location_id", 0).toString()
        );
      }
      if (_.get(init, "created_by", null) != null) {
        this.created_by = parseInt((init.created_by as number).toString());
      }
      if (_.get(init, "created_on", null) != null) {
        if (typeof init.created_on == "string") {
          this.created_on = new Date(init.created_on);
        } else {
          this.created_on = init.created_on!;
        }
      } else {
        this.created_on = new Date();
      }
      if (_.get(init, "modified_by", null) != null) {
        this.modified_by = parseInt((init.modified_by as number).toString());
      }
      if (_.get(init, "modified_on", null) != null) {
        if (typeof init.modified_on == "string") {
          this.modified_on = new Date(init.modified_on);
        } else {
          this.modified_on = init.modified_on!;
        }
      } else {
        this.modified_on = new Date();
      }
      this.is_active = _.get(init, "is_active", false);
      this.is_suspended = _.get(init, "is_suspended", false);
      if (_.get(init, "parent_id", null) != null) {
        this.parent_id = parseInt(_.get(init, "parent_id", 0).toString());
      }
      this.is_factory = _.get(init, "is_factory", false);
      this.notes = _.get(init, "notes", "");
      this.success_callback = _.get(init, "success_callback", "");
      this.failure_callback = _.get(init, "failure_callback", "");
      this.app_key = _.get(init, "app_key", "");

      this.root_username = _.get(init, "root_username", "");
      this.root_password = _.get(init, "root_password", "");
      this.root_confirmpassword = _.get(init, "root_confirmpassword", "");
      this.is_root_changed = _.get(init, "is_root_changed", false);

      /* LDAP configuratuion */
      this.ad_url = _.get(init, "ad_url", "");
      this.ad_baseDN = _.get(init, "ad_baseDN", "");
      this.ad_username = _.get(init, "ad_username", "");
      this.ad_password = _.get(init, "ad_password", "");
    }
  }
}
export class ApplicationWrapper extends Application {
  security_mode_display_text: string | null = null;
}
