import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as _ from "lodash";
import { EnterpriseMergeAlarmService } from "./enterprise-merge.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import {EnterpriseModel} from "../../models/enterprise.model";
import {ReferenceListModel} from "../../models/referencelist.model";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { EventEmitter } from "protractor";
import { ToastrService } from "ngx-toastr";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { ValidatorService } from "src/app/modules/global/service//validator/validator.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { StorageService } from "../../service/storage.service";
import { TranslateService } from "@ngx-translate/core";
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
  selector: "alarm-enterprise-merge",
  styleUrls: ["./enterprise-merge.alarm.component.css"],
  templateUrl: "./enterprise-merge.alarm.component.html"
})
export class EnterpriseMergeAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private enterprise_merge_alarm_service: EnterpriseMergeAlarmService,
    private toastr_service: ToastrService,
    private validator_service: ValidatorService,
    private storage_service: StorageService,
    public translate : TranslateService
  ) {}
  ngOnInit() {
    // initialize enterprise
    this.enterprise = new EnterpriseModel();
    // for confirm_password password
    this.enterprise.confirm_password = "";
    // get data
    this.getData();
    // getting id from route parameter
    this.route.queryParams.subscribe(params => {
      this.enterprise.id = _.get(params, "id", 0);
      if (this.enterprise.id != 0) {
        this.is_edit = true;
        this.getEnterpriseData();
      }
    });
  }

  matcher = new MyErrorStateMatcher();
  is_edit: boolean = false;
  enterprise: EnterpriseModel | any;
  locality_list = [];
  getData() {
    this.enterprise_merge_alarm_service.getLocalities().subscribe(
      (resp: ActionRes<Array<ReferenceListModel>>) => {
        if (resp.item) {
          this.locality_list = resp.item;
          // console.log("locality list: ", this.locality_list);
        }
      },
      error => {
        this.toastr_service.error(this.translate.instant("Error fetching / loading list of Localities"));
      }
    );
  }
  getEnterpriseData() {
    this.enterprise_merge_alarm_service.getEnterprisesById(this.enterprise.id).subscribe(
      (resp: ActionRes<EnterpriseModel>) => {
        if (_.get(resp, "item", null) != null) {
          this.enterprise = resp.item;
          // console.log("enterprise data: ", this.enterprise);
        }
      },
      error => {
        this.toastr_service.error(
          this.translate.instant(`Error on getting enterprise with id ${this.enterprise.id}`)
        );
      }
    );
  }
  
  cancel(){
    // this.router.navigate(["alarm/enterprise"]);
    let navigation_extras: NavigationExtras = {
      queryParams: {
        enterprise: false
      }
    };

    this.router.navigate(["alarm/accesscontrol"], navigation_extras);
    // this.storage_service.rooms$.next([]);
  }
  
  save(form: NgForm) {
    // console.log(form.value);
    
    if (form.valid) {
      var request = new ActionReq<EnterpriseModel>({
        item: this.enterprise
      });
      // console.log("Data to be updated: ", this.enterprise);
      this.enterprise_merge_alarm_service.saveEnterprise(request).subscribe(
        resp => {
          this.toastr_service.success(this.translate.instant("Enterprise definition saved successfully"));
        },
        error => {
          this.toastr_service.error(this.translate.instant("Error in saving Enterprise definition"));
        }
      );
    }
  }
}
