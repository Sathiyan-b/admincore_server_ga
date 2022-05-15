import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlarmsModel } from '../../models/alarms.model';
import * as _ from "lodash";

@Component({
  selector: 'app-alarm-merge',
  templateUrl: './alarm-merge.component.html',
  styleUrls: ['./alarm-merge.component.css']
})
export class AlarmMergeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
    this.getData();
  }
  alarm:AlarmsModel = new AlarmsModel();

  getData() {
    this.route.queryParams.subscribe((params) => {
      this.alarm.identifier = _.get(params, "identifier", "");
      this.alarm.alarm_desc = _.get(params, "alarm_desc", "");
      this.alarm.is_priority = _.get(params, "is_priority", false);
    });
  }
  save(form) {

  }
  cancel(form) {
    this.router.navigate(["alarm/accesscontrol"]);
  }
}
