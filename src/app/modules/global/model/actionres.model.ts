import {Base} from "./base.model";
import * as _ from "lodash";
class ActionRes<T> extends Base {
	status: string = "SUCCESS";
	exception: any = {};
	message: string = "";
	item?: T;
	constructor(init?: Partial<ActionRes<T>>) {
		super(init);
		if (init) {
			_.mapKeys(this, (v, k) => {
				if (_.get(init, k, null) != null) {
					_.set(this, k, _.get(init, k, null));
				}
			});

			//if the child is object use this method to initialize
			if (_.get(init, "item", null) != null) {
				this.item = init.item;
			}
		}
	}
}
// module ActionRes
// {
//     export enum statuses
//     {
// 		success="SUCCESS",
// 		failure="FAILURE"
//     }
// }

export default ActionRes;
