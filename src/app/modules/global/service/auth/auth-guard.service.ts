import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { GlobalService } from "../shared/global.service";
import { of, Observable } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import * as _ from "lodash";
@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate, CanLoad {
  constructor(
    public auth: AuthService,
    public router: Router,
    private global_service: GlobalService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let url: string = state.url;

    return this.checkLogin(url);
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    let url = _.reduce(
      segments,
      (path, current_segment, index) => {
        return `${path}/${current_segment.path}`;
      },
      ""
    );
    return this.checkLogin(url);
  }
  checkLogin(url) {
    if (!this.auth.isAuthenticated()) {
      this.auth.redirect_url = url;

      return this.auth.refreshAccessToken().pipe(
        switchMap((token: any) => {
          if (token) return of(true);
          else {
            this.auth.logout();
            return of(false);
          }
        }),
        catchError((err: any) => {
          this.auth.logout();
          return of(false);
        })
      );
    }
    return of(true);
  }
}
