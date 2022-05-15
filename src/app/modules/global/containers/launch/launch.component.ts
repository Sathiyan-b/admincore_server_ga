import { Component, OnInit } from "@angular/core";
import { LaunchService } from "./launch.service";
import { GlobalService } from "../../service/shared/global.service";
import { AppSettingsModel } from "src/app/modules/alarm/models/appsettings.model";
import ActionRes from "../../model/actionres.model";
import { Router } from "@angular/router";
import { UserModel } from "src/app/modules/alarm/models/user.model";
@Component({
  selector: "app-launch",
  templateUrl: "./launch.component.html",
  styleUrls: ["./launch.component.css"],
})
export class LaunchComponent implements OnInit {
  constructor(
    private launch_service: LaunchService,
    private global_service: GlobalService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getData();
  }
  getData() {
    /* get user_data from storage */
    var user_data_str = localStorage.getItem("user_data");
    try {
      this.global_service.user_data = JSON.parse(user_data_str);
    } catch (error) {
      this.global_service.user_data = new UserModel();
    }
    /* get app settings from server */
    this.launch_service
      .getAppSettings()
      .subscribe((resp: ActionRes<AppSettingsModel>) => {
        if (resp.item) {
          this.global_service.app_settings = resp.item;
          console.log("inside launch.component", resp.item);
          setTimeout(() => {
            console.log("user_data ### ",this.global_service)
            if (this.global_service.user_data.force_password_change == true) {
              this.router.navigate(["changepassword"]);
            }
            else {
            if (this.global_service.redirect_url.length == 0)
              this.router.navigateByUrl("/alarm");
            else this.router.navigateByUrl(this.global_service.redirect_url);
            }
          }, 2000);
        }
      });
  }
}
