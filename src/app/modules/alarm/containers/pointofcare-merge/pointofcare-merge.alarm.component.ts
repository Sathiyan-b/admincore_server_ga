import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { PointofcareMergeAlarmService } from "./pointofcare-merge.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { UserModel } from "../../models/user.model";
import * as _ from "lodash";
import {
  PointofcareEscalationModel,
  PointofcareModel,
  PointofcareUserModel,
} from "../../models/pointofcare.model";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";

import { forkJoin, Observable } from "rxjs";
import { UserTeamModel } from "../../models/userteam.model";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { Location } from "@angular/common";
import { EntHierarchyCriteria } from "../../models/enthierarchy.model";
import { ReferenceListModel } from "../../models/referencelist.model";
import { TranslateService } from "@ngx-translate/core";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import { MatDialog } from "@angular/material/dialog";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";

@Component({
  selector: "pointofcare-merge",
  templateUrl: "./pointofcare-merge.alarm.component.html",
  styleUrls: ["./pointofcare-merge.alarm.component.scss"],
  styles: [":host .mat-select- value {color: white!important;}"],
})
export class PointofcareMergeAlarmComponent implements OnInit {
  @ViewChild("PointofcareForm", { static: false }) form: NgForm;
  pointofcare: PointofcareModel = new PointofcareModel();
  pointofcare_list: Array<EntHierarchyCriteria> = [];
  is_edit: boolean = false;
  is_save: boolean = false;
  user_list: Array<UserModel> = [];
  userteam_list: Array<UserTeamModel> = [];
  user_and_userteam_list: Array<PointofcareEscalationModel> = [];
  filtered_user_and_userteam_list: Array<PointofcareEscalationModel> = [];
  duration_unit_list: Array<ReferenceListModel> = [];
  type_list: Array<ReferenceListModel> = [];
  selected_type: string = "";
  user_and_userteam_search_string: string = "";
  filtered_subscriber_list: Array<PointofcareUserModel> = [];
  subscriber_list: Array<PointofcareUserModel> = [];
  subscriber_search_string: string = "";
  select_poc: number = 0;
  constructor(
    private pointofcareMergeAlarmService: PointofcareMergeAlarmService,
    private point_of_care_service: PointofcareMergeAlarmService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private global_service: GlobalService,
    private location: Location,
    public translate: TranslateService,
    private alert_dialog: MatDialog,
    public user_permission_guard: UserPermissionGuardService
  ) {}

  ngOnInit() {
    this.pointofcare.id = _.get(this.route, "snapshot.queryParams.id", 0);
    if (this.pointofcare.id != 0) {
      this.is_edit = true;
    }
    this.getData();
  }
  getData = () => {
    var observable_array: Array<Observable<any>> = [];
    if (this.is_edit) {
      observable_array = [
        this.pointofcareMergeAlarmService.getUsers(),
        this.pointofcareMergeAlarmService.getUserTeam(),
        this.pointofcareMergeAlarmService.getReferenceList(
          ReferenceListModel.TYPES.POC_ESC_TO_TYPE
        ),
        this.pointofcareMergeAlarmService.getReferenceList(
          ReferenceListModel.TYPES.POC_ESC_DUR_UOM
        ),
        this.pointofcareMergeAlarmService.getPointofcareById(
          this.pointofcare.id
        ),
        this.pointofcareMergeAlarmService.getPointOfCareList(),
        // this.pointofcareMergeAlarmService.getMonitoringDataset(
        //   this.pointofcare.id
        // ),
      ];
    } else {
      observable_array = [
        this.pointofcareMergeAlarmService.getUsers(),
        this.pointofcareMergeAlarmService.getUserTeam(),
        this.pointofcareMergeAlarmService.getReferenceList(
          ReferenceListModel.TYPES.POC_ESC_TO_TYPE
        ),
        this.pointofcareMergeAlarmService.getReferenceList(
          ReferenceListModel.TYPES.POC_ESC_DUR_UOM
        ),
        this.pointofcareMergeAlarmService.getPointOfCareList(),
      ];
    }
    forkJoin(observable_array).subscribe(
      (resp: Array<ActionRes<any>>) => {
        if (_.has(resp, "0.item.0")) {
          this.user_list = resp[0].item;
        }
        if (_.has(resp, "1.item.0")) {
          this.userteam_list = resp[1].item;
        }
        if (_.has(resp, "2.item.0")) {
          this.type_list = resp[2].item;
          this.type_list.forEach((v) => {
            if (v.identifier == "USER") {
              this.selected_type = v.identifier;
            }
          });
        }
        if (_.has(resp, "3.item.0")) {
          this.duration_unit_list = resp[3].item;
        }
        if (this.is_edit && _.has(resp, "4.item.0")) {
          this.pointofcare = resp[4].item[0];
          this.select_poc = this.pointofcare.id;
          this.pointofcare.escalation_attribute.forEach((v) => {
            if (v.mname != null && v.mname.length > 0 || v.lname.length != null && v.lname.length > 0 ) {
              v.name = this.global_service.formatUsername(
                v.name,
                v.mname,
                v.lname
              );
            }
          });
          this.pointofcare.users_attribute.forEach((v2) => {
            if (
              v2.user_middle_name != null &&v2.user_middle_name.length > 0 ||
              v2.user_last_name != null && v2.user_last_name.length > 0
            ) {
              v2.user_first_name = this.global_service.formatUsername(
                v2.user_first_name,
                v2.user_middle_name,
                v2.user_last_name
              );
            }
          });
        } else if (_.has(resp, "4.item.0")) {
          this.pointofcare_list = resp[4].item;
        }
        if (this.is_edit && _.has(resp, "5.item.0")) {
          this.pointofcare_list = resp[5].item;
        }
        // _.forEach(this.user_list, (v) => {
        //   this.subscriber_list.push(
        //     new PointofcareUserModel({
        //       id: v.id,
        //       user_first_name: v.first_name,
        //     })
        //   );
        // });
        this.user_list.forEach((v) => {
          let formatted_name = this.global_service.formatUsername(
            v.first_name,
            v.middle_name,
            v.last_name
          );
          let temp = new PointofcareUserModel();
          temp.id = v.id;
          temp.user_first_name = formatted_name;
          temp.user_middle_name = v.middle_name;
          temp.user_last_name = v.last_name;
          this.subscriber_list.push(temp);
        });
        this.filtered_subscriber_list = _.filter(this.subscriber_list, (v) => {
          var index = _.findIndex(this.pointofcare.users_attribute, (w) => {
            return v.id == w.id;
          });
          return index == -1;
        });

        _.filter(this.user_list, (v) => {
          let formatted_name = this.global_service.formatUsername(
            v.first_name,
            v.middle_name,
            v.last_name
          );
          this.user_and_userteam_list.push(
            new PointofcareEscalationModel({
              id: v.id,
              name: formatted_name,
              mname: v.middle_name,
              lname: v.last_name,
              type: PointofcareEscalationModel.TYPE.user,
              duration: 1,
            } as any)
          );
        });
        _.filter(this.userteam_list, (v) => {
          this.user_and_userteam_list.push(
            new PointofcareEscalationModel({
              id: v.id,
              name: v.display_text,
              type: PointofcareEscalationModel.TYPE.team,
              duration: 1,
            } as any)
          );
        });
        if (this.is_edit) {
          // this.pointofcareMergeAlarmService = resp[1].item[0];
          // this.pointofcare = resp[1].item[0];

          this.user_and_userteam_list = _.filter(
            this.user_and_userteam_list,
            (v) => {
              var index = _.findIndex(
                this.pointofcare.escalation_attribute,
                (w) => {
                  return (
                    v.id == w.id && v.type.toUpperCase() == w.type.toUpperCase()
                  );
                }
              );
              return index == -1;
            }
          );
        }
        // console.log(
        //   "filtered user team and users ",
        //   this.user_and_userteam_list
        // );
        if (this.selected_type != "") {
          this.filtered_user_and_userteam_list = _.filter(
            this.user_and_userteam_list,
            (v) => {
              return v.type == this.selected_type;
            }
          );
        } else
          this.filtered_user_and_userteam_list = this.user_and_userteam_list;
        if (
          this.user_permission_guard.hasCanManageEscalationRoutingPermission()
        ) {
          _.forEach(this.filtered_user_and_userteam_list, (v) => {
            v.disabled = true;
          });
          _.forEach(this.pointofcare.escalation_attribute, (v) => {
            v.disabled = true;
          });
        }
      },
      (err) => {
        this.toastr_service.error("Error getting data.");
      }
    );
  };
  drop(event: CdkDragDrop<string[]>) {
    // console.log("form_poc ->", this.form);
    if (this.form && this.form.controls) {
      this.form.controls["purpose"].markAsDirty();
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  onUserAndUserTeamFilterChange(search_string: string) {
    this.filtered_user_and_userteam_list = _.filter(
      this.user_and_userteam_list,
      (v) => {
        var is_included = false;
        switch (this.selected_type) {
          case "USER":
            is_included = v.type == "USER";
            break;
          case "TEAM":
            is_included = v.type == "TEAM";
            break;

          default:
            break;
        }

        if (search_string.trim().length == 0) {
          is_included = is_included && true;
        } else if (
          (v as any).name.toLowerCase().includes(search_string.toLowerCase())
        ) {
          is_included = is_included && true;
        } else {
          is_included = false;
        }

        return is_included;
      }
    );
    this.filtered_user_and_userteam_list = _.differenceBy(
      this.filtered_user_and_userteam_list,
      this.pointofcare.escalation_attribute,
      (v) => {
        return v.id + " " + v.type;
      }
    );
    if (this.user_permission_guard.hasCanManageEscalationRoutingPermission()) {
      _.forEach(this.filtered_user_and_userteam_list, (v) => {
        v.disabled = true;
      });
      _.forEach(this.pointofcare.escalation_attribute, (v) => {
        v.disabled = true;
      });
    }
  }
  onSubscriberFilterChange(search_string: string) {
    this.filtered_subscriber_list = _.filter(this.subscriber_list, (v) => {
      var is_included = false;

      if (search_string.trim().length == 0) {
        is_included = true;
      } else if (
        v.user_first_name.toLowerCase().includes(search_string.toLowerCase())
      ) {
        is_included = true;
      }

      return is_included;
    });
    this.filtered_subscriber_list = _.differenceBy(
      this.filtered_subscriber_list,
      this.pointofcare.users_attribute,
      "id"
    );
  }
  onSave(form: NgForm) {
    if (form.valid) {
      var user_data_str: UserModel = JSON.parse(
        localStorage.getItem("user_data")
      );
      this.pointofcare.app_id = user_data_str.app_id;
      var request: ActionReq<PointofcareModel> =
        new ActionReq<PointofcareModel>({
          item: this.pointofcare,
        });
      this.point_of_care_service.savePointofcare(request).subscribe(
        (resp) => {
          this.is_save = true;
          if (request.item.id == 0) {
            this.toastr_service.success("Point of Care saved successfully");
          } else {
            this.toastr_service.success("Point of Care updated successfully");
          }
          if (this.pointofcare.id == 0) {
            this.pointofcare = new PointofcareModel();
          }
        },
        (err) => {
          this.toastr_service.error("Error saving Point of Care");
        }
      );
    }
  }
  navigateWithData() {
    let navigation_extras: NavigationExtras = {
      queryParams: {
        pointofcare: true,
      },
    };
    this.router.navigate(["alarm/accesscontrol"], navigation_extras);
  }
  onPointOfCareChange = (e, PointofcareForm: NgForm) => {
    if (!PointofcareForm.dirty) {
      this.pointofcare.id = e;
      this.getData();
    } else {
      this.toastr_service.error(
        this.translate.instant(
          "Changes made will be lost. Do you wish to continue?"
        )
      );
    }
  };
  cancel(PointofcareForm) {
    if (PointofcareForm.dirty && this.is_save === false) {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          message: this.translate.instant(
            `All changes will be lost. Do you wish to cancel?`
          ),
        },
      });
      alert.afterClosed().subscribe((is_reset) => {
        if (is_reset) {
          this.navigateWithData();
        }
      });
    } else this.navigateWithData();
  }
  // canDrop(item: CdkDrag, list: CdkDropList) {
  //   console.log("can Drop -- ", list, item);
  //   return (
  //     list && list.getSortedItems().length && list.getSortedItems().length > 0
  //   );
  // }
}
