import * as _ from "lodash";
import { Base } from "../../global/model/base.model";

export class PointofcareModel extends Base {
  id: number = 0;
  ent_hierarchy_parent_id: number = 0;
  identifier: string = "";
  display_text: string = "";
  purpose: string = "";
  enterprise: any = [];
  location: any = [];
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date = new Date();
  modified_on: Date = new Date();
  is_active: boolean | null = true;
  version: number = 1;
  lang_code: string = "en-GB";
  is_suspended: boolean | null = false;
  parent_id: number = 0;
  is_factory: boolean = false;
  users_attribute: Array<PointofcareUserModel> = [];
  escalation_attribute: Array<PointofcareEscalationModel> = [];
  poc_id: number = 0;
  overlap_duration: number = 0;
  overlap_duration_unit: string = Base.DURATION_TYPES.minutes;
  allow_subscriber: boolean = false;
  notes: string = "";
  app_id: number = 0;
  map_data: string = "";

  constructor(init?: Partial<PointofcareModel>) {
    super(init);
    if (init) {
      if (_.get(init, "id", null) != null) {
        this.id = parseInt(_.get(init, "id", 0).toString());
      }

      if (_.get(init, "ent_hierarchy_parent_id", null) != null) {
        this.ent_hierarchy_parent_id = parseInt(
          _.get(init, "ent_hierarchy_parent_id", 0).toString()
        );
      }

      if (_.get(init, "identifier", null) != null) {
        this.identifier = _.get(init, "identifier", "");
      }

      if (init.users_attribute instanceof Array) {
        this.users_attribute = init.users_attribute;
      }

      if (init.escalation_attribute instanceof Array) {
        this.escalation_attribute = init.escalation_attribute;
      }

      if (_.get(init, "parent_id", null) != null) {
        this.parent_id = parseInt(_.get(init, "parent_id", 0).toString());
      }

      if (_.get(init, "display_text", null) != null) {
        this.display_text = _.get(init, "display_text", "");
      }
      if (_.get(init, "purpose", null) != null) {
        this.purpose = _.get(init, "purpose", "");
      }
      if (_.get(init, "enterprise", null) != null) {
        try {
          if (typeof init!.enterprise == "string") {
            this.enterprise = JSON.parse(init!.enterprise);
          } else {
            this.enterprise = init!.enterprise;
          }
        } catch (error) {
          this.enterprise = [];
        }
      }
      if (_.get(init, "location", null) != null) {
        try {
          if (typeof init!.location == "string") {
            this.location = JSON.parse(init!.location);
          } else {
            this.location = init!.location;
          }
        } catch (error) {
          this.location = [];
        }
      }
      if (_.get(init, "created_by", null) != null) {
        this.created_by = parseInt(init.created_by!.toString());
      }
      //
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
        this.modified_by = parseInt(init.modified_by!.toString());
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
      if (_.get(init, "version", null) != null) {
        this.version = parseInt(init.version!.toString());
      }
      if (_.get(init, "is_active", null) != null) {
        this.is_active = _.get(init, "is_active", false);
      }
      if (_.get(init, "is_suspended", null) != null) {
        this.is_suspended = _.get(init, "is_suspended", false);
      }
      if (_.get(init, "is_factory", null) != null) {
        this.is_factory = _.get(init, "is_factory", false);
      }
      if (typeof init.overlap_duration == "number") {
        this.overlap_duration = init.overlap_duration;
      }
      if (typeof init.overlap_duration_unit == "string") {
        this.overlap_duration_unit = init.overlap_duration_unit;
      }
      if (typeof init.allow_subscriber == "boolean") {
        this.allow_subscriber = init.allow_subscriber;
      }
      if (typeof init.notes == "string") {
        this.notes = init.notes;
      }
      if (_.get(init, "app_id", null) != null) {
        this.app_id = parseInt(_.get(init, "app_id", 0).toString());
      }
      if (typeof init.map_data == "string") {
        this.map_data = init.map_data;
      }
    }
  }
}

export class PointofcareUserModel {
  id: number = 0;
  user_first_name: string = "";
  user_middle_name: string = "";
  user_last_name: string = "";
  constructor(init?: Partial<PointofcareUserModel>) {
    if (init) {
      if (typeof init.id == "number") {
        this.id = init.id;
      }
    }
  }
}
export class PointofcareEscalationModel extends Base {
  type: string = PointofcareEscalationModel.TYPE.user;
  name: string = "";
  mname: string = "";
  lname: string = "";
  id: number = 0;
  level: number = 0;
  duration: number = 0;
  duration_unit_uom: number = 30;
  disabled:boolean = false;
  constructor(init?: Partial<PointofcareEscalationModel>) {
    super(init);
    if (init) {
      if (typeof init.type == "string") {
        this.type = init.type;
      }
      if (typeof init.name == "string") {
        this.name = init.name;
      }
      if (typeof init.mname == "string") {
        this.mname = init.mname;
      }
      if (typeof init.lname == "string") {
        this.lname = init.lname;
      }
      if (typeof init.id == "number") {
        this.id = init.id;
      }
      if (typeof init.level == "number") {
        this.level = init.level;
      }
      if (typeof init.duration == "number") {
        this.duration = init.duration;
      }
      if (typeof init.duration_unit_uom == "number") {
        this.duration_unit_uom = init.duration_unit_uom;
      }
    }
  }
}
export namespace PointofcareEscalationModel {
  export enum TYPE {
    user = "USER",
    team = "TEAM",
  }
}

export class PointofcareModelCreteria extends PointofcareModel {
  is_subscribed: boolean = false;
  constructor(init?: Partial<PointofcareModelCreteria>) {
    super(init);
    if (init) {
      if (typeof init.is_subscribed == "boolean") {
        this.is_subscribed = init.is_subscribed;
      }
    }
  }
}
