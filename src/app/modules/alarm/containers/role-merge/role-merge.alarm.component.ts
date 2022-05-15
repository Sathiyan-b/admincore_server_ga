import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import {
  PrivilegeAssociationModel,
  PrivilegeExtnModel,
} from "../../models/privilege.model";
import { RoleMergeAlarmService } from "./role-merge.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import * as _ from "lodash";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { RoleProfileModel } from "../../models/roleprofile.model";
import { ToastrService } from "ngx-toastr";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { NgForm } from "@angular/forms";

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  OnEventArgs,
} from "angular-slickgrid";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserModel } from "../../models/user.model";
import { ValidatorService } from "src/app/modules/global/service/validator/validator.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { PopupCommonComponent } from "../popup-common/popup-common.component";

@Component({
  selector: "alarm-role-merge",
  styleUrls: ["./role-merge.alarm.component.css"],
  templateUrl: "./role-merge.alarm.component.html",
})
export class RoleMergeAlarmComponent implements OnInit {
  @ViewChild("roleMergeForm", { static: false }) form: NgForm;
  constructor(
    private role_merge_alarm_service: RoleMergeAlarmService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr_service: ToastrService,
    public validator_service: ValidatorService,
    private location: Location,
    private global_service: GlobalService,
    public translate: TranslateService,
    private alert_dialog: MatDialog
  ) {}
  ngOnInit() {
    this.setupLdapGroupListGrid();
    this.route.queryParams.subscribe((params) => {
      this.role.id = _.get(params, "id", 0);
      if (this.role.id != 0) {
        this.is_edit = true;
        this.getRoleData();
      } else {
        this.getData();
      }
    });
  }
  /* variables */
  is_edit: boolean = false;
  is_add: boolean = false;
  role: RoleProfileModel = new RoleProfileModel();
  //privilege_group: any = null;
  privilege_group: any = { privilege_group_id: null, display_text: "" };
  privilege_group_list: Array<PrivilegeExtnModel> = [];
  /* slick grid */
  ldap_group_list_angular_grid: AngularGridInstance;
  ldap_group_list_grid: any;
  ldap_group_list_grid_service: GridService;
  ldap_group_list_grid_data_view: any;
  ldap_group_list_grid_column_definitions: Column[];
  ldap_group_list_grid_options: GridOption;
  ldap_group_list_grid_dataset: any[];
  ldap_group_list_grid_updated_object: any;
  selected_ldap_group_rows = [];
  is_save: boolean = false;
  getData() {
    this.role_merge_alarm_service
      .getPrivilegeList()
      .subscribe((resp: ActionRes<Array<PrivilegeAssociationModel>>) => {
        if (resp.item && resp.item.length > 0) {
          var privileges: Array<PrivilegeAssociationModel> | any = resp.item;
          this.privilege_group_list = _.uniqBy(privileges, (v) => {
            return v.privilege_group_id;
          });
          _.forEach(this.role.privileges, (selected_privilege) => {
            var privilege = _.find(privileges, (v) => {
              return v.id == selected_privilege.id;
            });
            if (privilege) privilege.enabled = true;
          });
          this.role.privileges = privileges;

          this.selectprivileges = _.filter(
            privileges,
            (x) => x.enabled == true
          );
          this.listprivilege = _.filter(privileges, (x) => x.enabled != true);
          this.Totalprivilege = this.listprivilege;
        }
      });
    if (this.global_service.app_settings.auth_mode == "LDAP") {
      var request = new ActionReq<any>({
        item: {},
      });
      this.role_merge_alarm_service
        .getLDAPGroups(request)
        .subscribe((resp: ActionRes<Array<any>>) => {
          var ldap_group_list = _.forEach(resp.item, (v, k) => {
            v.id = k + 1;
          });
          _.forEach(this.role.ldap_config, (v) => {
            var group_index = _.findIndex(ldap_group_list, (group) => {
              return group.dn == v;
            });
            if (group_index != -1) ldap_group_list[group_index].enabled = true;
          });
          // this.ldap_group_list_grid.setSelectedRows(
          //   selected_ldap_group_rows
          // );
          this.ldap_group_list_grid_dataset = ldap_group_list;
          this.ldap_group_list_grid_service.resetGrid();
        });
    }
  }
  getRoleData() {
    this.role_merge_alarm_service.getRoleProfileById(this.role.id).subscribe(
      (resp: ActionRes<Array<RoleProfileModel>>) => {
        if (_.get(resp, "item.0", null) != null) {
          this.role = resp.item[0];
        }
        this.getData();
      },
      (error) => {
        this.toastr_service.error(
          this.translate.instant(
            `Error on fetching details of Role with id ${this.role.id}`
          )
        );
      }
    );
  }
  onPrivilegeGroupChange = (privilege_group) => {
    // this.privileges_selected = _.filter(this.privileges, v => {
    //   return privilege_group.privilege_group_id == v.privilege_group_id;
    // });
    if (privilege_group == undefined) {
      this.listprivilege = this.Totalprivilege;
    } else {
      this.listprivilege = _.filter(this.Totalprivilege, (v) => {
        return privilege_group.privilege_group_id == v.privilege_group_id;
      });
    }
  };

  addNew = (form: NgForm) => {
    this.is_add = false;
    this.role = new RoleProfileModel();
    form.resetForm();
    this.getData();
  };
  save(form: NgForm) {
    if (form.valid) {
      /*this.role.privileges = _.filter(this.role.privileges, (v: any) => {
        return v.enabled == true;
      }); */
      this.role.privileges = this.selectprivileges;

      this.role.ldap_config = _.map(this.ldap_group_list_grid_dataset, (v) => {
        if (v.enabled == true) return v.dn;
      });
      this.role.ldap_config = _.filter(this.role.ldap_config, (v) => {
        return v != null;
      });
      this.role.display_text = this.role.display_text
        .replace(" ", "_")
        .toUpperCase();
      var user_data_str: UserModel = JSON.parse(
        localStorage.getItem("user_data")
      );
      this.role.app_id = user_data_str.app_id;
      var request = new ActionReq({
        item: this.role,
      });
      this.role_merge_alarm_service.saveRoleProfileById(request).subscribe(
        (resp: ActionRes<RoleProfileModel>) => {
          if (request.item.id == 0) {
            this.toastr_service.success(
              this.translate.instant("Role saved successfully")
            );
          }
          if (request.item.id != 0) {
            this.toastr_service.success(
              this.translate.instant("Role updated successfully")
            );
          }
          this.is_save = true;
          this.is_add = true;
          var roleid = resp.item.id;
          this.role.id = roleid;
          // setTimeout(() => {
          //   let navigation_extras: NavigationExtras = {
          //     queryParams: {
          //       rolelist: true,
          //     },
          //   };
          //   this.router.navigate(["alarm/accesscontrol"], navigation_extras);
          // }, 500);
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
        },
        () => {
          // if (this.is_edit) {
          //   this.getData();
          // } else {
          //   this.location.back();
          // }
        }
      );
    }
  }
  navigationWithData() {
    let navigation_extras: NavigationExtras = {
      queryParams: {
        rolelist: true,
      },
    };
    this.router.navigate(["alarm/accesscontrol"], navigation_extras);
  }

  cancel(roleMergeForm: NgForm) {
    if (roleMergeForm.dirty && this.is_save === false) {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          message: this.translate.instant(
            `All changes will be lost. Do you wish to cancel?`
          ),
        },
      });
      alert.afterClosed().subscribe((is_reset) => {
        if (is_reset) {
          this.navigationWithData();
        }
      });
    } else this.navigationWithData();
  }
  /* slick grid */
  ldapGroupListGridReady(angularGrid: AngularGridInstance) {
    this.ldap_group_list_angular_grid = angularGrid;
    this.ldap_group_list_grid_data_view = angularGrid.dataView;
    this.ldap_group_list_grid = angularGrid.slickGrid;
    this.ldap_group_list_grid_service = angularGrid.gridService;
  }
  async onLdapGroupListGridCellChanged(e, args) {
    this.ldap_group_list_grid_updated_object = args.item;
    // this.ldap_group_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupLdapGroupListGrid() {
    this.ldap_group_list_grid_column_definitions = [
      {
        name: "✔",
        field: "enabled",
        id: "enabled",
        sortable: true,
        formatter: function (row, cell, value) {
          if (value == true) {
            return "✔";
          } else {
            return "☐";
          }
        },
        onCellClick: (e, args: OnEventArgs) => {
          var row_data = args.dataContext;
          row_data.enabled = !_.get(row_data, "enabled", false);
          this.ldap_group_list_grid_service.updateItem(row_data);
        },
        minWidth: 50,
        maxWidth: 50,
      },
      {
        name: "#",
        field: "",
        id: "",
        formatter: function (row) {
          return (row + 1).toString();
        },
        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "cn",
        name: "CN",
        field: "cn",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "dn",
        name: "DN",
        field: "dn",
        type: FieldType.string,
        sortable: true,
        minWidth: 400,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
    ];
    this.ldap_group_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "ldap_group-list-grid-container",
        // sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
    };
  }

  ldapGroupListHandleSelectedRowsChanged(e, args) {
    this.selected_ldap_group_rows = args.rows;
  }

  unSelectUserRows() {
    this.ldap_group_list_grid.setSelectedRows([]);
  }
  searchprivilege = "";
  selectprivileges: any = [];
  listprivilege: any = [];
  Totalprivilege: any = [];

  drop_privilege(event: CdkDragDrop<string[]>, form: NgForm) {
    // console.log('event ->', event)
    this.form.controls["name"].markAsDirty();
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
}
