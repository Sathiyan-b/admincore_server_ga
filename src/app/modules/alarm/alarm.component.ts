import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as JWT from "jwt-decode";

@Component({
  selector: "alarm-root",
  templateUrl: "./alarm.component.html",
  styleUrls: ["./alarm.component.css"]
})
export class AlarmComponent implements OnInit {
  title = "alarm";
  opened: boolean = true;
  events: string[] = [];
  is_mobile: boolean = false;
  constructor(
    public translate : TranslateService
  ) {}

  ngOnInit() {
    // this.translate.setDefaultLang("es-ES");
    this.identifyDevice();
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.identifyDevice();
  }
  identifyDevice() {
    var width = window.innerWidth;
    if (width > 992) {
      this.is_mobile = false;
      this.opened = true;
    } else {
      this.is_mobile = true;
      this.opened = false;
    }
  }
}
