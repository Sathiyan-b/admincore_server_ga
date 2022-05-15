import { Directive, Input } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { ApplicationService } from "src/app/modules/alarm/service/application.service";
import { UserMergeAlarmService } from "../../alarm/containers/user-merge/user-merge.alarm.service";
import { UserMergeUserModel } from "../../alarm/containers/user-merge/usermergeuser.model";
import ActionReq from "../model/actionreq.model";

@Directive({
  selector: "[UserEmailValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UserEmailAsyncValidatorDirective,
      multi: true,
    },
  ],
})
export class UserEmailAsyncValidatorDirective implements AsyncValidator {
  @Input("UserEmailValidator") user_id: number;

  constructor(private user_service: UserMergeAlarmService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    let req: ActionReq<UserMergeUserModel> = new ActionReq<UserMergeUserModel>({
      item: new UserMergeUserModel({
        email: control.value,
        id: this.user_id,
      }),
    });
    return this.user_service
      .validator(req)
      .then((is_exist) => (is_exist.length > 0 && is_exist[0].is_active ? { exist: true } : is_exist.length > 0 && !is_exist[0].is_active ? { active: true } : null ))
      .catch(() => of(null));
  }
}
