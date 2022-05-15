import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as _ from "lodash";
import { LocationMergeAlarmService, } from "./location-merge.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import {LocationModel} from "../../models/location.model";
import {EnterpriseModel} from "../../models/enterprise.model";
import { ReferenceListModel } from "../../models/referencelist.model";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { EventEmitter } from "protractor";
import { ToastrService } from "ngx-toastr";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { ValidatorService } from "src/app/modules/global/service//validator/validator.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: "alarm-location-merge",
  styleUrls: ["./location-merge.alarm.component.css"],
  templateUrl: "./location-merge.alarm.component.html"
})
export class LocationMergeAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location_merge_alarm_service: LocationMergeAlarmService,
    private toastr_service: ToastrService,
    private validator_service: ValidatorService
  ) {}
  ngOnInit() {
    // initialize location
    this.location = new LocationModel();
    // for confirm_password password
    // get data
    this.getData();
    // getting id from route parameter
    this.route.queryParams.subscribe(params => {
      this.location.id = _.get(params, "id", 0);
      if (this.location.id != 0) {
        this.is_edit = true;
        this.getLocationData();
      }
    });
    this.loadEnterprises();
  }
  matcher = new MyErrorStateMatcher();
  is_edit: boolean = false;
  location: LocationModel | any;
  locality_list = [];
  enterprise_list = [];
  getData() {
    this.location_merge_alarm_service.getLocalities().subscribe(
      (resp: ActionRes<Array<ReferenceListModel>>) => {
        if (resp.item) {
          this.locality_list = resp.item;
          // console.log("locality list: ", this.locality_list);
        }
      },
      error => {
        this.toastr_service.error("Error fetching / loading list of Localities");
      }
    );
  }
  getLocationData() {
    this.location_merge_alarm_service.getLocationsById(this.location.id).subscribe(
      (resp: ActionRes<LocationModel>) => {
        if (_.get(resp, "item", null) != null) {
          this.location = resp.item;
          // console.log("location data: ", this.location);
        }
      },
      error => {
        this.toastr_service.error(
          `Error on getting location with id ${this.location.id}`
        );
      }
    );
  }
  loadEnterprises() {
    this.location_merge_alarm_service.loadEnterprises().subscribe(
      (resp: ActionRes<Array<EnterpriseModel>>) => {
        if (_.get(resp, "item", null) != null) {
          this.enterprise_list = resp.item;
          // console.log("Enterprises List: ", this.enterprise_list);
        }
      },
      error => {
        this.toastr_service.error(
          `Error on loading Enterprises`
        );
      }
    );
  }
  
  cancel(){
   // this.router.navigate(["alarm/location"]);
    let navigation_extras: NavigationExtras = {
      queryParams: {
        location: true
      }
    };

    this.router.navigate(["alarm/accesscontrol"], navigation_extras);
  }
  
  save(form: NgForm) {
    // console.log(form.value);
    
    if (form.valid) {
      var request = new ActionReq<LocationModel>({
        item: this.location
      });
      // console.log("Data to be updated: ", this.location);
      this.location_merge_alarm_service.saveLocation(request).subscribe(
        resp => {
          this.toastr_service.success("Location definition saved successfully");
        },
        error => {
          this.toastr_service.error("Error in saving Location definition");
        }
      );
    }
  }
}
