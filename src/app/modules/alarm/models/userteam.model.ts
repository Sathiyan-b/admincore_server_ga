import * as _ from "lodash";
import { Base } from "../../global/model/base.model";

export class UserTeamModel extends Base {
	
	id: number = 0;
	identifier: string = "";
	display_text: string = "";
	team_purpose: string = "";
	start_time: string = "";
	end_time: string = "";
	app_id: number = 0;
	enterprise_id: number = 0;
	ent_location_id: number = 0;
	lang_code: string = "en-GB";
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date = new Date();
	modified_on: Date = new Date();
	is_active: boolean | null = true;
	is_suspended: boolean = false;
	parent_id: number = 0;
	is_factory: boolean = false;
	notes: string = "";
	members_attribute: Array<UserTeamMemberModel> = [];
	member_action_id:number=0
  
	// escalation_attribute: any = [];
	// enterprise: any = [];
	// location: any = [];
	
	constructor(init?: Partial<UserTeamModel>) {
		super(init);
		if (init) {
			if (_.get(init, "id", null) != null) {
			  this.id = parseInt(_.get(init, "id", 0).toString());
			}
			if (_.get(init, "member_action_id", null) != null) {
				this.member_action_id = parseInt(_.get(init, "member_action_id", 0).toString());
			  }
			if (_.get(init, "identifier", null) != null) {
			  this.identifier = _.get(init, "identifier", "");
			}
			if (_.get(init, "display_text", null) != null) {
			  this.display_text = _.get(init, "display_text", "");
			}
			if (_.get(init, "team_purpose", null) != null) {
			  this.team_purpose = _.get(init, "team_purpose", "");
			}
			if (_.get(init, "start_time", null) != null) {
			  this.start_time = _.get(init, "start_time", "");
			}
			if (_.get(init, "end_time", null) != null) {
			  this.end_time = _.get(init, "end_time", "");
			}
			if (_.get(init, "app_id", null) != null) {
			  this.app_id = parseInt(_.get(init, "app_id", 0).toString());
			}
			if (_.get(init, "enterprise_id", null) != null) {
			  this.enterprise_id = parseInt(_.get(init, "enterprise_id", 0).toString());
			}
			if (_.get(init, "ent_location_id", null) != null) {
			  this.ent_location_id = parseInt(_.get(init, "ent_location_id", 0).toString());
			}
			if (_.get(init, "created_by", null) != null) {
			  this.created_by = parseInt(_.get(init, "created_by", "0").toString());
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
			  this.modified_by = parseInt(_.get(init, "modified_by", "0").toString());
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
			if (_.get(init, "is_active", null) != null) {
			  this.is_active = _.get(init, "is_active", false);
			}
			if (_.get(init, "is_suspended", null) != null) {
			  this.is_suspended = _.get(init, "is_suspended", false);
			}
			if (_.get(init, "parent_id", null) != null) {
			  this.parent_id = parseInt(_.get(init, "parent_id", 0).toString());
			}
			if (_.get(init, "is_factory", null) != null) {
			  this.is_factory = _.get(init, "is_factory", false);
			}
			if (_.get(init, "notes", null) != null) {
			  this.notes = _.get(init, "notes", "");
			}
			if (init.members_attribute instanceof Array) {
			  this.members_attribute = init.members_attribute;
			}
	  
	  
	  
	  
	  
		   
			// if (_.get(init, "escalation_attribute", null) != null) {
			//   try {
			//     if (typeof init!.escalation_attribute == "string") {
			//       this.escalation_attribute = JSON.parse(init!.escalation_attribute);
			//     } else {
			//       this.escalation_attribute = init!.escalation_attribute;
			//     }
			//   } catch (error) {
			//     this.escalation_attribute = {};
			//   }
			// }
			// if (_.get(init, "enterprise", null) != null) {
			//   try {
			//     if (typeof init!.enterprise == "string") {
			//       this.enterprise = JSON.parse(init!.enterprise);
			//     } else {
			//       this.enterprise = init!.enterprise;
			//     }
			//   } catch (error) {
			//     this.enterprise = {};
			//   }
			// }
			// if (_.get(init, "location", null) != null) {
			//   try {
			//     if (typeof init!.location == "string") {
			//       this.location = JSON.parse(init!.location);
			//     } else {
			//       this.location = init!.location;
			//     }
			//   } catch (error) {
			//     this.location = {};
			//   }
			// }
			//
		   
		  }
	}
}

export class UserTeamMemberModel {
	id: number = 0;
	user_first_name: string = "";
 	user_middle_name: string = "";
  	user_last_name: string = "";
	member_action_id:number = 0
	role: string = UserTeamMemberModel.ROLE.read_only;
	constructor(init?: Partial<UserTeamMemberModel>) {
		if (init) {
			if (typeof init.id == "number") {
				this.id = init.id;
			}
			if (typeof init.role == "string") {
				this.role = init.role;
			}
			if (typeof init.user_first_name == "string") {
				this.user_first_name = init.user_first_name;
			}
			if (typeof init.user_middle_name == "string") {
				this.user_middle_name = init.user_middle_name;
			}
			if (typeof init.user_last_name == "string") {
				this.user_last_name = init.user_last_name;
			}
			if (typeof init.member_action_id == "number") {
				this.member_action_id = init.member_action_id;
			}
		}
	}
}
export namespace UserTeamMemberModel {
	export enum ROLE {
		read_only = "READONLY",
		Accept_and_reject = "ACCEPTREJECT",
	}
}
