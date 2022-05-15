import { Base } from "../../global/model/base.model";
import * as _ from "lodash";
export class EnterpriseModel extends Base {
	id: number = 0;
	ent_type_id: string = "";
	identifier: string = "";
	short_name: string = "";
	display_text: string = "";
	is_master_org: boolean = false;
	image_id: number = 0;
	timezone_id: number = 0;
	is_point_of_care: boolean = false;
	lang_code: string = "en-GB";
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date = new Date();
	modified_on: Date = new Date();
	is_active: boolean = true;
	version: number = 1;
	is_suspended: boolean = false;
	parent_id: number = 0;
	is_factory: boolean = false;
	notes: string = "";
			
	constructor(init?: Partial<EnterpriseModel>) {
		super(init);
		if (init) {
		    if (_.get(init, "image_id", null) != null) {
				this.image_id = parseInt(_.get(init, "image_id", 0).toString());
			}
			if (_.get(init, "ent_type_id", null) != null) {
				this.ent_type_id = _.get(init, "ent_type_id", "");
			}
			if (_.get(init, "identifier", null) != null) {
				this.identifier = _.get(init, "identifier", "");
			}
			if (_.get(init, "short_name", null) != null) {
				this.short_name = _.get(init, "short_name", "");
			}
			if (_.get(init, "id", null) != null) {
				this.id = parseInt(_.get(init, "id", 0).toString());
			}
			if (_.get(init, "display_text", null) != null) {
				this.display_text = _.get(init, "display_text", "");
			}
			if (_.get(init, "is_master_org", null) != null) {
				this.is_master_org = _.get(init, "is_master_org", false);
			}
			if (_.get(init, "timezone_id", null) != null) {
				this.timezone_id = parseInt(_.get(init, "timezone_id", 0).toString());
			}
			if (_.get(init, "is_point_of_care", null) != null) {
				this.is_point_of_care = _.get(init, "is_point_of_care", false);
			}
			if (_.get(init, "lang_code", null) != null) {
				this.lang_code = _.get(init, "lang_code", "");
			}
			if (_.get(init, "created_by", null) != null) {
				this.created_by = parseInt(
					_.get(init, "created_by", "0").toString()
				);
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
				this.modified_by = parseInt(
					_.get(init, "modified_by", "0").toString()
				);
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
				this.version = parseInt(_.get(init, "version", 0).toString());
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
		}
	}
}

export class EnterpriseAssociation extends Base {
	id: number = 0;
	code: string = "";
	display_text: string = "";
	constructor(init?: Partial<EnterpriseAssociation>) {
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


export class EnterpriseHierarchyListModel extends Base {
	eid: number = 0;
	enterprisename: string = "";
	pointofcare_id: number = 0;
	room_id: number = 0;
	bedid: number = 0;
	bedname: string = "";
	pocname: string = "";
	roomname: string = "";

	constructor(init?: Partial<EnterpriseHierarchyListModel>) {
		super(init);
		if (init) {
		    if (_.get(init, "eid", null) != null) {
				this.eid = parseInt(_.get(init, "eid", 0).toString());
			}
			if (_.get(init, "enterprisename", null) != null) {
				this.enterprisename = _.get(init, "enterprisename", "");
			}
			if (_.get(init, "pointofcare_id", null) != null) {
				this.pointofcare_id = parseInt(_.get(init, "pointofcare_id", 0).toString());
			}
			if (_.get(init, "room_id", null) != null) {
				this.room_id = parseInt(_.get(init, "room_id", 0).toString());
			}
			if (_.get(init, "bedid", null) != null) {
				this.bedid = parseInt(_.get(init, "bedid", 0).toString());
			}
			if (_.get(init, "bedname", null) != null) {
				this.bedname = _.get(init, "bedname", "");
			}
			if (_.get(init, "pocname", null) != null) {
				this.pocname = _.get(init, "pocname", "");
			}
			if (_.get(init, "roomname", null) != null) {
				this.roomname = _.get(init, "roomname", "");
			}
			
		}
	}
}