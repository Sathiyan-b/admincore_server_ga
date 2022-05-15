import * as _ from "lodash";
import { Base } from "../../global/model/base.model";

export class ActiveDirectoryModel extends Base {
	name: string = "";
	dn: string = "";
	url: string = "";
	user_name: string = "";
	password: string = "";

	constructor(init?: Partial<ActiveDirectoryModel>) {
		super(init);
		if (init) {
			if (_.get(init, "name", null) != null) {
				this.name = _.get(init, "name", "");
			}
			if (_.get(init, "dn", null) != null) {
				this.dn = _.get(init, "dn", "");
			}
			if (_.get(init, "url", null) != null) {
				this.url = _.get(init, "url", "");
			}
			if (_.get(init, "user_name", null) != null) {
				this.user_name = _.get(init, "user_name", "");
			}
			if (_.get(init, "password", null) != null) {
				this.password = _.get(init, "password", "");
			}
		}
	}
}

export class AppSettingsModel extends Base {
	id: number = 0;
	auth_mode: string = ""; // LDAP or Native indicator
	ldap_config: any = [];
	active_directories: any = [];
	configuration: any = []; //all key-value set
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date = new Date();
	modified_on: Date = new Date();
	is_active: boolean = true;
	version: number = 1;
	lang_code: string = "en-GB";
	is_suspended: boolean = false;
	parent_id: number = 0;
	is_factory: boolean = false;
	notes: string = "";
	enterprise_id: number = 0;
	location_id: number = 0;

	constructor(init?: Partial<AppSettingsModel>) {
		super(init);
		if (init) {
			this.id = parseInt(_.get(init, "id", 0).toString());
			this.auth_mode = _.get(init, "auth_mode", "");
			//
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
			if (_.get(init, "active_directories", null) != null) {
				try {
					if (typeof init!.active_directories == "string") {
						this.active_directories = JSON.parse(init!.active_directories);
					} else {
						this.active_directories = init!.active_directories;
					}
				} catch (error) {
					this.active_directories = {};
				}
			}
			//
			if (_.get(init, "configuration", null) != null) {
				try {
					if (typeof init!.configuration == "string") {
						this.configuration = JSON.parse(init!.configuration);
					} else {
						this.configuration = init!.configuration;
					}
				} catch (error) {
					this.configuration = {};
				}
			}
			//
			if (_.get(init, "created_by", null) != null) {
				this.created_by = parseInt(
					_.get(init, "created_by", "0").toString()
				);
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
				this.modified_by = parseInt(
					_.get(init, "modified_by", "0").toString()
				);
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
				this.version = parseInt(_.get(init, "version", 0).toString());
			}
			if (_.get(init, "is_active", null) != null) {
				this.is_active = _.get(init, "is_active", false);
			}
			if (_.get(init, "is_suspended", null) != null) {
				this.is_suspended = _.get(init, "is_suspended", false);
			}
			if (_.get(init, "notes", null) != null) {
				this.notes = _.get(init, "notes", "");
			}
			/* _.mapKeys(this, (v, k) => {
				if (_.get(init, k, null) != null) {
					_.set(this, k, _.get(init, k, null));
				}
			}); */
			if (_.get(init, "enterprise_id", null) != null) {
				this.enterprise_id = parseInt(init.enterprise_id!.toString());
			}
			if (_.get(init, "location_id", null) != null) {
				this.location_id = parseInt(init.location_id!.toString());
			}
		}
	}
}

