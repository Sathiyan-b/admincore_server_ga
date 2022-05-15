import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as JWT from 'jwt-decode';

@Component({
  selector: "alarm-header",
  templateUrl: "./alarm-header.component.html",
  styleUrls: ["./alarm-header.component.css"]
})
export class AlarmHeaderComponent implements OnInit {
  name = "";
  constructor(private router: Router) {}

  ngOnInit() {
    let token = localStorage.getItem("token");
    if (token !== null) {
      let decoded: any = JWT(token);
      this.name = decoded.data.name;
    }
  }

  logout(event) {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }
}
