import { UserRoleProfile } from "../../models/roleprofile.model";
import { UserModel } from "../../models/user.model";

export class UserMergeUserModel extends UserModel {
  confirm_password: string = "";
}
