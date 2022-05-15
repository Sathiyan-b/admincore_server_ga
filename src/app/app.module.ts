// Angular Imports
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, OnInit } from "@angular/core";
import { AuthInterceptor } from "./modules/global/service/auth-http-interceptor/auth-http-interceptor.service";
// material imports
import { MatMomentDateModule } from "@angular/material-moment-adapter";

// routing module
import { AppRoutingModule } from "./app-routing.module";

// auth
import { JwtModule, JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";

// components
import { ToastrModule } from "ngx-toastr";
import { HttpClientHelper } from "./modules/global/service/helpers/HttpClientHelper";
import { AngularSlickgridModule } from "angular-slickgrid";

// screens
import { AppComponent } from "./app.component";
import { PagenotfoundComponent } from "./modules/global/containers/pagenotfound/pagenotfound.component";
import { LoginComponent } from "./modules/global/containers/login/login.component";

// modules
import { BreadcrumbComponent } from "./modules/global/containers/breadcrumb/breadcrumb.component";
import { SharedModule } from "./modules/global/global.module";
import { CustomValidatorDirective } from "./modules/global/directives/custom-validator.directive";
import { GlobalService } from "./modules/global/service/shared/global.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

//translation

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [
    // ui components
    // Dialogs
    // Screens
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatIconModule,
    ToastrModule.forRoot(),
    AngularSlickgridModule.forRoot(),
    // modules
    SharedModule.forRoot(),
    //translation
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    JwtHelperService,
    HttpClientHelper,
    MatMomentDateModule,
    MatIconRegistry,
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
