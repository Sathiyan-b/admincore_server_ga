import { Directive } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { ApplicationWrapper } from "src/app/modules/alarm/models/application.model";
import { ApplicationService } from "src/app/modules/alarm/service/application.service";

@Directive({
  selector: "[AppValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ApplicationAsyncValidatorDirective,
      multi: true, 
    },
  ],
})
export class ApplicationAsyncValidatorDirective implements AsyncValidator {
  constructor(private app_service: ApplicationService) {}
  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    let req: ApplicationWrapper = new ApplicationWrapper();
    req.display_text = control.value;
    return this.app_service
      .get(req)
      .then((is_exist) => (is_exist.length > 0 ? { exist: true } : null))
      .catch(() => of(null));
  }
}
