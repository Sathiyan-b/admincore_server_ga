import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "access-denied",
    templateUrl: "./access-denied.component.html",
    styleUrls: ["./access-denied.component.scss"],
  })

  export class AccessDeniedComponent {
    constructor(
        public router: Router,
    ) {}

    redirecturl() {
        this.router.navigate(["/alarm"]);
    }
  }