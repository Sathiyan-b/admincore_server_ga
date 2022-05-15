// Third Example - icon module
import { NgModule } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [],
})
export class IconModule {
  private path: string = "assets/icons";
  constructor(
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry
  ) {
    this.matIconRegistry
      .addSvgIcon("user", this.setIconPath(`${this.path}/user.svg`))
      .addSvgIcon(
        "create-user",
        this.setIconPath(`${this.path}/createuser.svg`)
      )
      .addSvgIcon("edit-user", this.setIconPath(`${this.path}/edit-user.svg`))

      .addSvgIcon("role", this.setIconPath(`${this.path}/role.svg`))
      .addSvgIcon(
        "create-role",
        this.setIconPath(`${this.path}/createrole.svg`)
      )
      .addSvgIcon("edit-role", this.setIconPath(`${this.path}/edit-role.svg`))
      .addSvgIcon("userteam", this.setIconPath(`${this.path}/userteam.svg`))
      .addSvgIcon(
        "create-userteam",
        this.setIconPath(`${this.path}/createuserteam.svg`)
      )
      .addSvgIcon(
        "edit-userteam",
        this.setIconPath(`${this.path}/edit-userteam.svg`)
      )
      .addSvgIcon(
        "pointofcare",
        this.setIconPath(`${this.path}/pointofcare.svg`)
      )
      .addSvgIcon(
        "edit-pointofcare",
        this.setIconPath(`${this.path}/edit-pointofcare.svg`)
      )
      .addSvgIcon(
        "passwordpolicy",
        this.setIconPath(`${this.path}/passwordpolicy.svg`)
      )
      .addSvgIcon(
        "registeredapplication",
        this.setIconPath(`${this.path}/registeredapplications.svg`)
      )
      .addSvgIcon(
        "create-registeredapplication",
        this.setIconPath(`${this.path}/createregisterapplications.svg`)
      )
      .addSvgIcon(
        "edit-registeredapplication",
        this.setIconPath(`${this.path}/edit-registeredapplication.svg`)
      )
      .addSvgIcon("settings", this.setIconPath(`${this.path}/settings.svg`))
      .addSvgIcon("enterprise", this.setIconPath(`${this.path}/enterprise.svg`))
      .addSvgIcon("device", this.setIconPath(`${this.path}/device.svg`))
      .addSvgIcon(
        "deviceImport",
        this.setIconPath(`${this.path}/device-import.svg`)
      )
      .addSvgIcon(
        "deviceEdit",
        this.setIconPath(`${this.path}/device-edit.svg`)
      )
      .addSvgIcon("alarm", this.setIconPath(`${this.path}/alarm.svg`))
      .addSvgIcon("activate", this.setIconPath(`${this.path}/activate.svg`))
      .addSvgIcon(
        "import-LDAP",
        this.setIconPath(`${this.path}/import-LDAP.svg`)
      )
      .addSvgIcon(
        "import-user",
        this.setIconPath(`${this.path}/import-user.svg`)
      );
  }

  private setIconPath(icon: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(icon);
  }
}
