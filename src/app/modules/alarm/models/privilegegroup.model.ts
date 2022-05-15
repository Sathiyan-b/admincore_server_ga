import { Base } from "../../global/model/base.model";
import * as _ from "lodash";
export class PrivilegeGroupModel extends Base {
	id: number = 0;
	privilege_group_key: string="";
	display_text : string = "";
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
	app_id:number=0;
			
	constructor(init?: Partial<PrivilegeGroupModel>) {
		super(init);
		if (init) {
			this.id = parseInt(_.get(init, "id", 0).toString());
			this.privilege_group_key = _.get(init, "privilege_group_key", "");
			this.display_text = _.get(init, "display_text", "");
			//
			this.created_by = parseInt(_.get(init, "created_by", "0").toString());
			if (_.get(init, "created_on", null) != null) {
				if (typeof init.created_on == "string") {
					this.created_on = new Date(init.created_on);
				} else {
					this.created_on = init.created_on!;
				}
			} else {
				this.created_on = new Date();
			}
			this.modified_by = parseInt(_.get(init, "modified_by", "0").toString());
			if (_.get(init, "modified_on", null) != null) {
				if (typeof init.modified_on == "string") {
					this.modified_on = new Date(init.modified_on);
				} else {
					this.modified_on = init.modified_on!;
				}
			} else {
				this.modified_on = new Date();
			}
			this.version = parseInt(_.get(init, "version", "").toString());
			this.is_active = _.get(init, "is_active", false);
			this.is_suspended =  _.get(init, "is_suspended", false);
			this.notes = _.get(init, "notes", "");
			if (_.get(init, "app_id", null) != null) {
				this.app_id = parseInt(_.get(init, "app_id", 0).toString());
			}
		}
	}
}


