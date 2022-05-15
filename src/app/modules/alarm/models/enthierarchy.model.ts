import * as _ from "lodash";
import { Base } from "../../global/model/base.model";

export class EntHierarchyModel extends Base {
  id: number = 0;
  ent_type_id: string = "";
  ent_short_name: string = "";
  ent_name: string = "";
  is_master_org: boolean = false;
  image_id: number | null = null;
  timezone_id: number | null = null;
  is_point_of_care: number = 0;
  lang_code: string = "en-GB";

  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date = new Date();
  modified_on: Date = new Date();
  is_active: boolean | null = true;
  version: number = 1;
  is_suspended: boolean | null = false;
  parent_id: number = 0;
  is_factory: boolean = false;
  notes: string = "";

  constructor(init?: Partial<EntHierarchyModel>) {
    super(init);
    if (init) {
      if (_.get(init, "id", null) != null) {
        this.id = parseInt(_.get(init, "id", 0).toString());
      }
      if (_.get(init, "ent_type_id", null) != null) {
        this.ent_type_id = _.get(init, "ent_type_id", "");
      }
      if (_.get(init, "ent_short_name", null) != null) {
        this.ent_short_name = _.get(init, "ent_short_name", "");
      }
      if (_.get(init, "ent_name", null) != null) {
        this.ent_short_name = _.get(init, "ent_name", "");
      }
      if (_.get(init, "is_master_org", null) != null) {
        this.is_master_org = _.get(init, "is_master_org", false);
      }
      if (_.get(init, "image_id", null) !== null) {
        this.image_id = parseInt((_.get(init, "image_id", 0) || 0).toString());
      }
      if (_.get(init, "timezone_id", null) !== null) {
        this.timezone_id = parseInt(
          (_.get(init, "timezone_id", 0) || 0).toString()
        );
      }
      if (_.get(init, "is_point_of_care", null) !== null) {
        this.is_point_of_care = parseInt(
          _.get(init, "is_point_of_care", 0).toString()
        );
      }
      if (_.get(init, "lang_code", null) != null) {
        this.lang_code = _.get(init, "lang_code", "");
      }

      if (_.get(init, "created_by", null) != null) {
        this.created_by = parseInt(init.created_by!.toString());
      }
      //
      if (_.get(init, "created_on", null) != null) {
        if (typeof init?.created_on == "string") {
          this.created_on = new Date(init.created_on);
        } else {
          this.created_on = init?.created_on!;
        }
      } else {
        this.created_on = new Date();
      }
      if (_.get(init, "modified_by", null) != null) {
        this.modified_by = parseInt(init.modified_by!.toString());
      }

      if (_.get(init, "modified_on", null) != null) {
        if (typeof init?.modified_on == "string") {
          this.modified_on = new Date(init.modified_on);
        } else {
          this.modified_on = init?.modified_on!;
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
      if (_.get(init, "parent_id", null) != null) {
        this.parent_id = parseInt(_.get(init, "parent_id", 0).toString());
      }
      if (_.get(init, "notes", null) != null) {
        this.notes = _.get(init, "notes", "");
      }
    }
  }
}
export namespace EntHierarchyModel {
  export enum TYPE {
    Enterprise = "Enterprise",
    Location = "Location",
    Building = "Building",
    Floor = "Floor",
    Facility = "Facility",
    Ward = "Ward",
    Room = "Room",
    Bed = "Bed",
  }
}

export class EntHierarchyTreeModel extends EntHierarchyModel {
  children: EntHierarchyTreeModel | null = null;
  constructor(init?: Partial<EntHierarchyTreeModel>) {
    super(init);
    if (init) {
      if (init.children != null) {
        this.children = new EntHierarchyTreeModel(init.children);
      }
    }
  }
}
export class EntHierarchyCriteria extends Base {
  id: number = 0;
  identifier: string = "";
  ent_type: string = "";
  short_name: string = "";
  display_text: string = "";
  is_master_org: boolean = false;
  is_point_of_care: boolean = false;
  parent_id: number = 0;
  multilevel: boolean = false;
  children: Array<EntHierarchyCriteria> | null = null;

  constructor(init?: Partial<EntHierarchyCriteria>) {
    super(init);
    if (init) {
      if (_.get(init, "id", null) != null) {
        this.id = parseInt(_.get(init, "id", 0).toString());
      }
      if (_.get(init, "identifier", null) != null) {
        this.identifier = _.get(init, "identifier", "");
      }
      if (_.get(init, "ent_type", null) != null) {
        this.ent_type = _.get(init, "ent_type", "");
      }
      if (_.get(init, "short_name", null) != null) {
        this.short_name = _.get(init, "short_name", "");
      }
      if (_.get(init, "display_text", null) != null) {
        this.display_text = _.get(init, "display_text", "");
      }
      if (_.get(init, "is_master_org", null) != null) {
        this.is_master_org = _.get(init, "is_master_org", false);
      }
      if (_.get(init, "is_point_of_care", null) != null) {
        this.is_point_of_care = _.get(init, "is_point_of_care", false);
      }
      if (_.get(init, "parent_id", null) != null) {
        this.parent_id = parseInt(_.get(init, "parent_id", 0).toString());
      }
      if (_.get(init, "multilevel", null) != null) {
        this.multilevel = _.get(init, "multilevel", false);
      }
      if (init.children != null && init.children.length > 0) {
        _.forEach(init.children, (v1) => {
          if (v1 != null) this.children?.push(new EntHierarchyCriteria(v1));
        });
      }
    }
  }
}
// export default EntHierarchyModel;
