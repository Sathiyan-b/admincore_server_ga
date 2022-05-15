import { Directive, Input } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { UserTeamAlarmService } from "../../alarm/containers/user-team/user-team.alarm.service";
import { UserTeamModel } from "../../alarm/models/userteam.model";

@Directive({
  selector: "[UserTeamNameValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UserTeamNameAsyncValidatorDirective,
      multi: true,
    },
  ],
})
export class UserTeamNameAsyncValidatorDirective implements AsyncValidator {
  @Input("UserTeamNameValidator") user_id: number;

  constructor(private userteam_service: UserTeamAlarmService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    let req: UserTeamModel = new UserTeamModel();
    req.display_text = control.value;
    req.id = this.user_id;

    return this.userteam_service
      .validator(req)
      .then((is_exist) => (is_exist.length > 0 && is_exist[0].is_active ? { exist: true } : is_exist.length > 0 && is_exist[0].is_active == false ? { active: true } : null ))
      .catch(() => of(null));
  }
}
