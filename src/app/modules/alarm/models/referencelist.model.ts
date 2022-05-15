import * as _ from "lodash";
import { Base } from "../../global/model/base.model";

import { json_custom_parser } from "../../global/utils";
export class ReferenceListModel extends Base {
  id: number = 0;
  ref_type_id: number = 0;
  identifier: string = "";
  display_text: string = "";
  lang_code: string = "en-GB";
  app_id: number = 0;
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

  attributes: ReferenceListModel.Attributes =
    new ReferenceListModel.Attributes();

  constructor(init?: Partial<ReferenceListModel>) {
    super(init);
    if (init) {
      if (_.get(init, "id", null) != null) {
        this.id = parseInt((init.id as number).toString());
      }
      if (_.get(init, "ref_type_id", null) != null) {
        this.ref_type_id = parseInt((init.ref_type_id as number).toString());
      }
      this.identifier = _.get(init, "identifier", "");
      this.display_text = _.get(init, "display_text", "");
      if (_.get(init, "app_id", null) != null) {
        this.app_id = parseInt(_.get(init, "app_id", 0).toString());
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
      if (init.attributes) {
        if (typeof init.attributes == "string")
          init.attributes = json_custom_parser.parse(
            init.attributes,
            new ReferenceListModel.Attributes()
          );
        this.attributes = new ReferenceListModel.Attributes(init.attributes);
      }
    }
  }
}

export namespace ReferenceListModel {
  export enum TYPES {
    MONITORING_DATA = "MONITORING_DATA",
    MONITORING_VALUE_SPARK_LINE = "MONITORING_VALUE_SPARK_LINE",
    MONITORING_VALUE_COLOR = "MONITORING_VALUE_COLOR",
    MONITORING_VALUE_BACKGROUND_SHAPE = "MONITORING_VALUE_BACKGROUND_SHAPE",
    TREND_INDICATORS = "TREND_INDICATORS",
    DATE_RANGE_UNITS = "DATE_RANGE_UNITS",
    DRUG_CLASS = "DRUG_CLASS",
    DRUG_ADMINISTRATION_MODE = "DRUG_ADMINISTRATION_MODE",
    SECURITY_MODE = "AUTH_MODE",
    POC_ESC_TO_TYPE = "POC_ESC_TO_TYPE",
    POC_ESC_DUR_UOM = "POC_ESC_DUR_UOM",
    TEAM_MEMBER_ACTION_TYPE = "TEAM_MEMBER_ACTION_TYPE",
    DEVICE_PAT = "DEVICE_PAT",
    DEVICE_MANF = "DEVICE_MANF",
    DEVICE_MODEL = "DEVICE_MODEL",
    DEVICE_TYPE = "DEVICE_TYPE",
  }
  export class Attributes {
    icon: string = "";
    constructor(init?: Partial<Attributes>) {
      if (init) {
        if (typeof init.icon == "string") this.icon = init.icon;
      }
    }
  }
}
