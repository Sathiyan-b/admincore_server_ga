import { Component, OnInit } from "@angular/core";
@Component({
  selector: "alarm-home",
  styleUrls: ["./home.alarm.component.css"],
  templateUrl: "./home.alarm.component.html"
})
export class HomeAlarmComponent implements OnInit {
  role = {
    name: "",
    description: "",
    privilege_group_list: [
      {
        id: 1,
        name: "admin",
        privilege_list: [
          {
            id: 1,
            name: "create users"
          },
          {
            id: 2,
            name: "edit users"
          },
          {
            id: 3,
            name: "delete users"
          }
        ]
      },
      {
        id: 2,
        name: "standard user",
        privilege_list: [
          {
            id: 4,
            name: "execute application"
          }
        ]
      }
    ]
  };
  privilege_group: any = null;
  constructor() {}
  ngOnInit() {}
}
