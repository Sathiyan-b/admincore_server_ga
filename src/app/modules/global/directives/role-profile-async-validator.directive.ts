import { Directive, Input } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { RoleMergeAlarmService } from "../../alarm/containers/role-merge/role-merge.alarm.service";
import { RoleProfileModel } from "../../alarm/models/roleprofile.model";
import ActionReq from "../model/actionreq.model";

@Directive({
  selector: "[RoleProfileNameValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: RoleProfileNameAsyncValidatorDirective,
      multi: true,
    },
  ],
})
export class RoleProfileNameAsyncValidatorDirective implements AsyncValidator {
  @Input("RoleProfileNameValidator") user_id: number;

  constructor(private roleprofile_service: RoleMergeAlarmService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    let req: RoleProfileModel = new RoleProfileModel();
    req.display_text = control.value;
    req.id = this.user_id;

    return this.roleprofile_service
      .validator(req)
      .then((is_exist) => (is_exist.length > 0 && is_exist[0].is_active ? { exist: true } : is_exist.length > 0 && !is_exist[0].is_active ? { active: true } : null ))
      // .then((is_exist) => (is_exist.length > 0 ? { exist: true } : null))
      .catch(() => of(null));
  }
}
