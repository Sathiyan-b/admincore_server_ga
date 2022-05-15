import {Base} from "./base.model";
import * as _ from "lodash";
class ActionReq<T> extends Base {
	lastupdate: string = "";
	item?: T;
	constructor(init?: Partial<ActionReq<T>>) {
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
export default ActionReq;
