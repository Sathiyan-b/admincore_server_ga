import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import * as JWT from "jwt-decode";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "ctrlpanel";

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    {
      this.matIconRegistry
        .addSvgIcon(
          "user",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/user.svg"
          )
        )
        .addSvgIcon(
          "create-user",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/createuser.svg"
          )
        )
        .addSvgIcon(
          "edit-user",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/edit-user.svg"
          )
        )
        .addSvgIcon(
          "role",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/role.svg"
          )
        )
        .addSvgIcon(
          "create-role",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/createrole.svg"
          )
        )
        .addSvgIcon(
          "edit-role",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/edit-role.svg"
          )
        )
        .addSvgIcon(
          "userteam",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/userteam.svg"
          )
        )
        .addSvgIcon(
          "create-userteam",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/createuserteam.svg"
          )
        )
        .addSvgIcon(
          "edit-userteam",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/edit-userteam.svg"
          )
        )
        .addSvgIcon(
          "pointofcare",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/pointofcare.svg"
          )
        )
        .addSvgIcon(
          "edit-pointofcare",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/edit-pointofcare.svg"
          )
        )
        .addSvgIcon(
          "passwordpolicy",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/passwordpolicy.svg"
          )
        )
        .addSvgIcon(
          "registeredapplication",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/registeredapplications.svg"
          )
        )
        .addSvgIcon(
          "create-registeredapplication",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/createregisterapplications.svg"
          )
        )
        .addSvgIcon(
          "edit-registeredapplication",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/edit-registeredapplication.svg"
          )
        )
        .addSvgIcon(
          "settings",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/settings.svg"
          )
        )
        .addSvgIcon(
          "enterprise",
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            "/assets/icons/enterprise.svg"
          )
        );
    }
  }
}
