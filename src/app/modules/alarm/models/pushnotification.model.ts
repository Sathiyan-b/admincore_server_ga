import { Base } from "../../global/model/base.model";
import * as _ from "lodash";
export class PushNotificationModel<T> extends Base {
	token_list: Array<string> = [];
	title: string = "";
	sub_title: string = "";
	body: string = "";
	data?: T;
	constructor(init?: Partial<PushNotificationModel<T>>) {
		super(init);
		if (init) {
			if (_.isArray(init.token_list)) this.token_list = init.token_list;
			if (typeof init.title == "string") this.title = init.title;
			if (typeof init.sub_title == "string")
				this.sub_title = init.sub_title;
			if (typeof init.body == "string") this.body = init.body;
			if (_.has(init, "data")) this.data = init.data;
		}
	}
}
