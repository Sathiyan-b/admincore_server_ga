import { Base } from "../../global/model/base.model";
import * as _ from "lodash";

export class FileManagerModel extends Base {
	id: number = 0;
	category:string="";
	content: any ="";
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
	
	constructor(init?: Partial<FileManagerModel>) {
		super(init);
		if (init) {
			if (_.get(init, "id", null) != null) {
				this.id = parseInt(_.get(init, "id", 0).toString());
			}
			if (_.get(init, "category", null) != null) {
				this.category = _.get(init, "category", "");
			}
			if (_.get(init, "content", null) != null) {
				this.content = _.get(init, "content", "");
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
		}
	}
}
export default FileManagerModel