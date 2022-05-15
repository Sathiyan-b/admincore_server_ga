import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  Formatters,
  Formatter,
  OnEventArgs,
} from "angular-slickgrid";
import { UserTeamMergeAlarmService } from "./user-team-merge.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { UserModel } from "../../models/user.model";
import * as _ from "lodash";
import {
  UserTeamMemberModel,
  UserTeamModel,
} from "../../models/userteam.model";
import { ValidatorService } from "src/app/modules/global/service/validator/validator.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { forkJoin, Observable } from "rxjs";
import { ReferenceListService } from "../../service/referencelist.service";
import { ReferenceListModel } from "../../models/referencelist.model";
import { TranslateService } from "@ngx-translate/core";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import { MatDialog } from "@angular/material/dialog";
import { action } from "@circlon/angular-tree-component/lib/mobx-angular/mobx-proxy";

@Component({
  selector: "user-team-merge",
  templateUrl: "./user-team-merge.alarm.component.html",
  styleUrls: ["./user-team-merge.alarm.component.css"],
  styles: [":host .mat-select- value {color: white!important;}"],
})
export class UserTeamMergeAlarmComponent implements OnInit {
  @ViewChild("UserTeamForm", { static: false }) form: NgForm;
  user_team: UserTeamModel = new UserTeamModel();
  user_list: Array<UserTeamMemberModel> = new Array<UserTeamMemberModel>();
  filtered_user_list: Array<UserTeamMemberModel> =
    new Array<UserTeamMemberModel>();
  is_edit: boolean = false;
  is_add: boolean = false;
  to_save: boolean = false;
  is_save: boolean = false;
  search_string: string = "";
  role_list: Array<ReferenceListModel> = [];
  selected_role: string = "";
  constructor(
    private userTeamMergeAlarmService: UserTeamMergeAlarmService,
    private toastr_service: ToastrService,
    public validator_service: ValidatorService,
    private router: Router,
    private route: ActivatedRoute,
    public global_service: GlobalService,
    private referencelist_service: ReferenceListService,
    public translate: TranslateService,
    private alert_dialog: MatDialog
  ) {}
  ngOnInit() {
    this.getData();
  }
  getData = async () => {
    this.user_team.id = _.get(this.route, "snapshot.queryParams.id", 0);
    if (this.user_team.id > 0) {
      this.is_edit = true;
    }
    var observerable_list: Array<Observable<any>> = [];
    try {
      let referencelist_req = new ReferenceListModel();
      referencelist_req.identifier =
        ReferenceListModel.TYPES.TEAM_MEMBER_ACTION_TYPE;
      this.role_list = await this.referencelist_service.get(referencelist_req);
    } catch (error) {}
    if (this.is_edit) {
      observerable_list = [
        this.userTeamMergeAlarmService.getUsers(),
        this.userTeamMergeAlarmService.getUserTeamById(this.user_team.id),
      ];
    } else {
      observerable_list = [this.userTeamMergeAlarmService.getUsers()];
    }
    forkJoin(observerable_list).subscribe((resp: Array<ActionRes<any>>) => {
      var user_list_temp = resp[0].item as Array<UserModel>;
      user_list_temp = _.filter(user_list_temp,(v)=>{
        return v.is_factory == false;
      })
      this.user_list = _.map(user_list_temp, (v) => {
        let formatted_name = this.global_service.formatUsername(
          v.first_name,
          v.middle_name,
          v.last_name
        );
        return new UserTeamMemberModel({
          id: v.id,
          user_first_name: formatted_name,
          role: UserTeamMemberModel.ROLE.read_only,
          member_action_id: this.role_list[0].id,
          // member_action_id : this.role_list.map(v=> {
          //   if(v.identifier == UserTeamMemberModel.ROLE.read_only) {
          //     return v.id
          //   }
          // })
        });
      });
      if (this.is_edit) {
        this.user_team = resp[1].item[0];
        this.user_team.members_attribute.forEach(v=>{
          if(v.user_first_name.length > 0) {
            v.user_first_name = this.global_service.formatUsername(
              v.user_first_name,
              v.user_middle_name,
              v.user_last_name
            );
          }
        })

        this.filtered_user_list = _.filter(this.user_list, (user) => {
          var index = _.findIndex(
            this.user_team.members_attribute,
            (member: any) => {
              return user.id == member.id;
            }
          );
          return index == -1;
        });
      } else {
        this.filtered_user_list = this.user_list;
      }
    });
  };

  navigateWithData() {
    let navigation_extras: NavigationExtras = {
      queryParams: {
        userteam: true,
      },
    };
    this.router.navigate(["alarm/accesscontrol"], navigation_extras);
  }
  cancel(UserTeamForm: NgForm) {
    if (UserTeamForm.dirty && this.is_save === false) {
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
  addNew = (form: NgForm) => {
    this.is_add = false;
    this.user_team = new UserTeamModel();
    form.resetForm();
    this.getData();
  };
  drop(event: CdkDragDrop<string[]>) {
    this.form.controls["display_text"].markAsDirty();
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
  onFilterChange(search_string: string) {
    this.filtered_user_list = _.filter(this.user_list, (v) => {
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
    this.filtered_user_list = _.differenceBy(
      this.filtered_user_list,
      this.user_team.members_attribute,
      "id"
    );
  }
  onSave(form: NgForm) {
    try{
      if(!form.valid) {
        return;
      }
      this.to_save = true;
      var user_data_str: UserModel = JSON.parse(
        localStorage.getItem("user_data")
      );
      this.user_team.app_id = user_data_str.app_id;
      this.user_team.members_attribute.forEach(v=>{
        this.role_list.forEach(v2=>{
          if(v.member_action_id == v2.id) {
            v.role = v2.identifier;
          }
        })
      })
      var actionCount = 0;
      this.user_team.members_attribute.forEach(v=> {
        if(v.role == UserTeamMemberModel.ROLE.Accept_and_reject){
          actionCount = actionCount + 1;
        }
      })
      if(actionCount == 0) {
        this.toastr_service.error(`Minimum 1 user required Accept/reject action in Team`);
        // return;
      }
      var request: ActionReq<UserTeamModel> = new ActionReq<UserTeamModel>({
        item: this.user_team,
      });
      this.userTeamMergeAlarmService.postUserTeam(request).subscribe(
        (resp) => {
          this.is_save = true;
          if(request.item.id == 0) {
          this.toastr_service.success(
            this.translate.instant("User Team Saved Successfully")
          );
          }
          else {
            this.toastr_service.success(
              this.translate.instant("User Team Updated successfully")
            );
          }
          this.is_add = true;
          this.user_team.id = _.get(resp, "item.id", 0);
        },
        (error) => {
          var error_msg =
            error && error.error && error.error.message
              ? error.error.message
              : "";
          this.toastr_service.error(
            error_msg.length > 0
              ? error_msg
              : this.translate.instant("Error saving")
          );
        }
      );
    }
    catch (e) {
      this.toastr_service.error("Internal Error")
    }
    // this.form.reset(this.form.value);
    // this.form['UserTeamForm']._pristine = true;
  }
}
