import { Base } from "../../global/model/base.model";
import * as _ from "lodash";

export class PasswordPolicyModel extends Base {
	id: number = 0;
	min_length: number = 6;
	max_length: number = 15;
	repeat_old_password_restriction: number = 5;
	password_change_frequency: number = 180;
	failed_login_attempts_allowed: number = 5;
	enforce_password_change: boolean = false;
	can_allow_uppercase: boolean = false;
	min_uppercase_reqd: boolean = false;
	can_allow_lowercase: boolean = false;
	min_lowercase_reqd: boolean = false;
	can_allow_numerals: boolean = false;
	min_numerals_reqd: boolean = false;
	can_allow_special_characters: boolean = false;
	min_special_characters_reqd: boolean = false;
	can_start_with_numeric: boolean = false;
	can_start_with_special_character: boolean = false;
	enterprise: any = [];
	location: any = [];
	app_id:number=0;
		
	//
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
	notes: string = "";
	//
	constructor(init?: Partial<PasswordPolicyModel>) {
		super(init);
		if (init) {
			if (_.get(init, "id", null) != null) {
				this.id = parseInt(_.get(init, "id", 0).toString());
			}
			if (_.get(init, "min_length", null) != null) {
				this.min_length = parseInt(_.get(init, "min_length", 0).toString());
			}
			if (_.get(init, "max_length", null) != null) {
				this.max_length = parseInt(_.get(init, "max_length", 0).toString());
			}
			// if (_.get(init, "min_numerals_reqd", null) != null) {
			// 	this.min_numerals_reqd = parseInt(_.get(init, "min_numerals_reqd", 0).toString());
			// }
			// if (_.get(init, "max_special_characters", null) != null) {
			// 	this.max_special_characters = parseInt(_.get(init, "max_special_characters", 0).toString());
			// }
			if (_.get(init, "repeat_old_password_restriction", null) != null) {
				this.repeat_old_password_restriction = parseInt(_.get(init, "repeat_old_password_restriction", 0).toString());
			}
			if (_.get(init, "password_change_frequency", null) != null) {
				this.password_change_frequency = parseInt(_.get(init, "password_change_frequency", 0).toString());
			}
			if (_.get(init, "failed_login_attempts_allowed", null) != null) {
				this.failed_login_attempts_allowed = parseInt(_.get(init, "failed_login_attempts_allowed", 0).toString());
			}
			if (_.get(init, "can_allow_numerals", null) != null) {
				this.can_allow_numerals = _.get(
					init,
					"can_allow_numerals",
					false
				);
			}
			if (_.get(init, "min_numerals_reqd", null) != null) {
				this.min_numerals_reqd = _.get(
					init,
					"min_numerals_reqd",
					false
				);
			}
			if (_.get(init, "can_allow_uppercase", null) != null) {
				this.can_allow_uppercase = _.get(
					init,
					"can_allow_uppercase",
					false
				);
			}
			if (_.get(init, "min_uppercase_reqd", null) != null) {
				this.min_uppercase_reqd = _.get(
					init,
					"min_uppercase_reqd",
					false
				);
			}
			if (_.get(init, "can_allow_lowercase", null) != null) {
				this.can_allow_lowercase = _.get(
					init,
					"can_allow_lowercase",
					false
				);
			}
			if (_.get(init, "min_lowercase_reqd", null) != null) {
				this.min_lowercase_reqd = _.get(
					init,
					"min_lowercase_reqd",
					false
				);
			}
			// if (_.get(init, "can_start_with_numeric", null) != null) {
			// 	this.can_start_with_numeric = _.get(
			// 		init,
			// 		"can_start_with_numeric",
			// 		false
			// 	);
			// }
			// if (_.get(init, "can_allow_special_characters", null) != null) {
			// 	this.can_allow_special_characters = _.get(
			// 		init,
			// 		"can_allow_special_characters",
			// 		false
			// 	);   
			// }
			if (_.get(init, "min_special_characters_reqd", null) != null) {
				this.min_special_characters_reqd = _.get(
					init,
					"min_special_characters_reqd",
					false
				);
			}
			// if (_.get(init, "can_start_with_special_character", null) != null) {
			// 	this.can_start_with_special_character = _.get(
			// 		init,
			// 		"can_start_with_special_character",
			// 		false
			// 	);
			// }
			if (_.get(init, "enforce_password_change", null) != null) {
				this.enforce_password_change = _.get(
					init,
					"enforce_password_change",
					false
				);
			}
			if (_.get(init, "enterprise", null) != null) {
				try {
					if (typeof init!.enterprise == "string") {
						this.enterprise = JSON.parse(init!.enterprise);
					} else {
						this.enterprise = init!.enterprise;
					}
				} catch (error) {
					this.enterprise = {};
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
					this.location = {};
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
			if (_.get(init, "notes", null) != null) {
				this.notes = _.get(init, "notes", "");
			}
			if (_.get(init, "app_id", null) != null) {
				this.app_id = parseInt(_.get(init, "app_id", 0).toString());
			}
		}
	}
}
export default PasswordPolicyModel