import {Base} from "./base.model";
import * as _ from "lodash";
class ErrorResponse<T> extends Base {
	status: string = "FAILURE";
	message: string = "";
	item?: any={};
	error :any ={};
	constructor(init?: Partial<ErrorResponse<T>>) {
		super(init);
		if (init) {
			_.mapKeys(this, (v, k) => {
				if (_.get(init, k, null) != null) {
					_.set(this, k, _.get(init, k, null));
				}
			});

		}
	}
}
// module ErrorResponse
// {
//     export enum statuses
//     {
// 		success="SUCCESS",
// 		failure="FAILURE"
//     }
// }

export default ErrorResponse;
