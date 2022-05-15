import { Base } from "../../global/model/base.model";
import * as _ from "lodash";

export class RoleProfileModel extends Base {
	id: number = 0;
	identifier: string = "";
	display_text: string = "";
	purpose  :string = ""
	app_id: number = 0;
	enterprise_id: number = 0;
	ent_location_id: number = 0;
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date = new Date();
	modified_on: Date = new Date();
	is_active: boolean | null = true;
	lang_code: string = "en-GB";
	is_suspended: boolean | null = false;
	parent_id: number = 0;
	is_factory: boolean = false;
	notes: string = "";
  
	ldap_config: any = [];
	privileges: any = [];
  
	constructor(init?: Partial<RoleProfileModel>) {
	  super(init);
	  if (init) {
		if (_.get(init, "id", null) != null) {
		  this.id = parseInt(_.get(init, "id", 0).toString());
		}
		if (_.get(init, "identifier", null) != null) {
		  this.identifier = _.get(init, "identifier", "");
		}
		if (_.get(init, "display_text", null) != null) {
		  this.display_text = _.get(init, "display_text", "");
		}
		if (_.get(init, "purpose", null) != null) {
		  this.purpose = _.get(init, "purpose", "");
		}
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
		//
		if (_.get(init, "created_by", null) != null) {
		  this.created_by = parseInt(init.created_by!.toString());
		}
  
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
		this.is_active = _.get(init, "is_active", false);
		if (_.get(init, "is_factory", null) != null) {
		  this.is_factory = _.get(init, "is_factory", false);
		}
  
		if (_.get(init, "parent_id", null) != null) {
		  this.parent_id = parseInt(_.get(init, "parent_id", 0).toString());
		}
		this.notes = _.get(init, "notes", "");
		if (_.get(init, "ldap_config", null) != null) {
		  try {
			if (typeof init!.ldap_config == "string") {
			  this.ldap_config = JSON.parse(init!.ldap_config);
			} else {
			  this.ldap_config = init!.ldap_config;
			}
		  } catch (error) {
			this.ldap_config = {};
		  }
		}
	  }
	}
}

export class UserRoleProfile extends Base {
	id: number = 0;
  user_id: number = 0;
  roleprofile_id: number  = 0;
  app_id: number = 0;
  enterprise_id: number = 0;
  ent_location_id: number = 0;
  valid_from: Date = new Date();
  valid_to: Date = new Date();
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date = new Date();
  modified_on: Date = new Date();
  is_active: boolean | null = true;
  lang_code: string = "en-GB";
  is_suspended: boolean | null = false;
  parent_id: number = 0;
  is_factory: boolean = false;
  notes: string = "";
  constructor(init?:Partial<UserRoleProfile>){
    super(init);
    if(init){
      if (_.get(init, "id", null) != null) {
        this.id = parseInt(_.get(init, "id", 0).toString());
      }
      if (_.get(init, "user_id", null) != null) {
        this.user_id = parseInt(_.get(init, "user_id", 0).toString());
      }
      if (_.get(init, "roleprofile_id", null) != null) {
        this.roleprofile_id = parseInt(_.get(init, "roleprofile_id", 0).toString());
      }
      if (_.get(init, "app_id", null) != null) {
        this.app_id = parseInt(_.get(init, "app_id", 0).toString());
      }
      if (_.get(init, "valid_from", null) != null) {
        if (typeof init?.valid_from == "string") {
          this.valid_from = new Date(init.valid_from);
        } else {
          this.valid_from = init?.valid_from!;
        }
      } else {
        this.valid_from = new Date();
      }
      if (_.get(init, "valid_to", null) != null) {
        if (typeof init?.valid_to == "string") {
          this.valid_to = new Date(init.valid_to);
        } else {
          this.valid_to = init?.valid_to!;
        }
      } else {
        this.valid_to = new Date();
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
      //
      if (_.get(init, "created_by", null) != null) {
        this.created_by = parseInt(init.created_by!.toString());
      }

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
      this.is_active = _.get(init, "is_active", false);
      if (_.get(init, "is_factory", null) != null) {
        this.is_factory = _.get(init, "is_factory", false);
      }
      if (_.get(init, "is_suspended", null) != null) {
        this.is_suspended = _.get(init, "is_suspended", false);
      }
      if (_.get(init, "parent_id", null) != null) {
        this.parent_id = parseInt(_.get(init, "parent_id", 0).toString());
      }
      this.notes = _.get(init, "notes", "");
    }
  }
};

