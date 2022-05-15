import { Base } from "../../global/model/base.model";
import * as _ from "lodash";
export class LocationModel extends Base {
	id: number = 0;
	display_text: string = "";
	code: string = "";
	license: string = "";
	address_line_1: string = "";
	address_line_2: string = "";
	phone_1: string = "";
	phone_2: string = "";
	locality: string = "";
	zipcode: string = "";
	fax: string = "";
	email: string = "";
	website: string = "";
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
	enterprise: any = [];
	enterprise_id: number = 0;
	enterprise_name: string = "";
	app_id:number=0;
	
	constructor(init?: Partial<LocationModel>) {
		super(init);
		if (init) {
			if (_.get(init, "id", null) != null) {
				this.id = parseInt(_.get(init, "id", 0).toString());
			}
			if (_.get(init, "display_text", null) != null) {
				this.display_text = _.get(init, "display_text", "");
			}
			if (_.get(init, "code", null) != null) {
				this.code = _.get(init, "code", "");
			}
			if (_.get(init, "license", null) != null) {
				this.license = _.get(init, "license", "");
			}
			if (_.get(init, "address_line_1", null) != null) {
				this.address_line_1 = _.get(init, "address_line_1", "");
			}
			if (_.get(init, "address_line_2", null) != null) {
				this.address_line_2 = _.get(init, "address_line_2", "");
			}
			if (_.get(init, "phone_1", null) != null) {
				this.phone_1 = _.get(init, "phone_1", "");
			}
			if (_.get(init, "phone_2", null) != null) {
				this.phone_2 = _.get(init, "phone_2", "");
			}
			if (_.get(init, "locality", null) != null) {
				this.locality = _.get(init, "locality", "");
			}
			if (_.get(init, "zipcode", null) != null) {
				this.zipcode = _.get(init, "zipcode", "");
			}
			if (_.get(init, "fax", null) != null) {
				this.fax = _.get(init, "fax", "");
			}
			if (_.get(init, "email", null) != null) {
				this.email = _.get(init, "email", "");
			}
			if (_.get(init, "website", null) != null) {
				this.website = _.get(init, "website", "");
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
			if (_.get(init, "enterprise_id", null) != null) {
				this.enterprise_id = parseInt(init.enterprise_id!.toString());
			}
			if (_.get(init, "enterprise_name", null) != null) {
				this.enterprise_name = _.get(init, "enterprise_name", "");
			}
			if (_.get(init, "app_id", null) != null) {
				this.app_id = parseInt(_.get(init, "app_id", 0).toString());
			}
		}
	}
}

export class LocationAssociation extends Base {
	id: number = 0;
	code: string = "";
	display_text: string = "";
	constructor(init?: Partial<LocationAssociation>) {
		super(init);
		if (init) {
			if (_.get(init, "id", null) != null) {
				this.id = parseInt(_.get(init, "id", 0).toString());
			}
			if (_.get(init, "code", null) != null) {
				this.code = _.get(init, "code", "");
			}
			if (_.get(init, "display_text", null) != null) {
				this.display_text = _.get(init, "display_text", "");
			}
		}
	}
}
