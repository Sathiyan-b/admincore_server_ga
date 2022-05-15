import { Component, OnInit } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  Formatter,
  OnEventArgs,
} from "angular-slickgrid";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { UsersAlarmService } from "./users.alarm.service";
import { RoleMergeAlarmService } from "../role-merge/role-merge.alarm.service";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import * as _ from "lodash";
import { RoleProfileModel } from "../../models/roleprofile.model";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, forkJoin } from "rxjs";
import { UserModel } from "../../models/user.model";
import * as moment from "moment";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { MatDialog } from "@angular/material/dialog";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import { data } from "jquery";
import { TranslateService } from "@ngx-translate/core";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";

@Component({
  selector: "alarm-users",
  templateUrl: "./users.alarm.component.html",
  styleUrls: ["./users.alarm.component.css"],
})
export class UsersAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr_service: ToastrService,
    private role_merge_alarm_service: RoleMergeAlarmService,
    private users_alarm_service: UsersAlarmService,
    private global_service: GlobalService,
    private alert_dialog: MatDialog,
    public translate: TranslateService,
    public user_permission_guard: UserPermissionGuardService
  ) {}

  is_ldap_mode: boolean = false;

  ngOnInit() {
    this.setupUserListGrid();
    this.getData();
  }

  /* variables */
  user_filter_list = [];
  selected_user_filter = null;
  selected_user_rows = [];
  permission: any = {};
  /* slick grid */
  user_list_angular_grid: AngularGridInstance;
  user_list_grid: any;
  user_list_grid_service: GridService;
  user_list_grid_data_view: any;
  user_list_grid_column_definitions: Column[];
  user_list_grid_options: GridOption;
  user_list_grid_dataset: any[];
  user_list_grid_updated_object: any;
  delete = "INACTIVE";
  lock = "LOCKED";
  rowSelected: boolean = false;
  // PermissFlag = 0;
  /*
 1 --  Manage
 2 --- change_status
 3 --- View
 */

  getData() {
    /* permissions */
    this.permission = this.global_service.permission_object;

    // if (
    //   this.global_service.user_data.user_type_id == 0 ||
    //   this.permission.user.manage == true
    // ) {
    //   this.PermissFlag = 1;
    // } else if (this.permission.user.change_status == true) {
    //   this.PermissFlag = 2;
    // } else if (this.permission.user.view == true) {
    //   this.PermissFlag = 3;
    // }
    /* get user types */
    this.user_filter_list = [
      {
        name: "active",
        code: "ACTIVE",
      },
      {
        name: "inactive",
        code: "INACTIVE",
      },
      {
        name: "locked",
        code: "LOCKED",
      },
    ];
    if (this.selected_user_filter === null) {
      this.selected_user_filter = this.user_filter_list[0];
    }

    /* get users */
    this.is_ldap_mode =
      this.global_service.app_settings.auth_mode == "LDAP" ? true : false;
    this.getNativeorLDAPUsers();
  }
  getNativeorLDAPUsers() {
    var request = new UserModel();
    request.user_type_id = this.is_ldap_mode ? 1 : 2;
    switch (this.selected_user_filter.code) {
      case "ACTIVE":
        request.is_active = true;
        break;
      case "INACTIVE":
        request.is_active = false;
        break;
      case "LOCKED":
        // request.is_active = null;
        request.is_suspended = true;
        break;
      default:
        break;
    }
    this.users_alarm_service.getUsers(request).subscribe(
      (resp: ActionRes<Array<UserModel>>) => {
        if (resp.item) {
          this.user_list_grid_dataset = resp.item;
          // this.user_list_grid_service.renderGrid();
        }
      },
      (error) => {
        var error_msg =
          error && error.error && error.error.message
            ? error.error.message
            : "";
        this.toastr_service.error(
          error_msg.length > 0 ? error_msg : "Error fetching data"
        );
      }
    );
  }
  userListGridReady(angularGrid: AngularGridInstance) {
    this.user_list_angular_grid = angularGrid;
    this.user_list_grid_data_view = angularGrid.dataView;
    this.user_list_grid = angularGrid.slickGrid;
    this.user_list_grid_service = angularGrid.gridService;
    this.translate.onLangChange.subscribe((lang) => {
      var cols = angularGrid.extensionService.getAllColumns();
      for (var i = 0, il = cols.length; i < il; i++) {
        if (
          cols[i].id &&
          typeof cols[i].id == "string" &&
          (cols[i].id as string).length > 0
        )
          cols[i].name = this.translate.instant(cols[i].id as string);
      }
      // this.user_list_angular_grid.extensionService.renderColumnHeaders(cols);
    });
  }
  async onUserListGridCellChanged(e, args) {
    this.user_list_grid_updated_object = args.item;
    // this.user_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupUserListGrid() {
    this.user_list_grid_column_definitions = [
      {
        name: "#",
        field: "",
        id: 4,
        formatter: function (row) {
          return (row + 1).toString();
        },
        width: 40,
      },
      {
        id: "Name",
        name: this.translate.instant(
          this.is_ldap_mode ? "Display Name" : "Name"
        ),
        field: "first_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        filterable: true,
        filter: { model: Filters.compoundInput },
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var name_string = "";
          if (_.get(dataContext, "first_name", null) != null) {
            name_string = this.global_service.formatUsername(
              dataContext.first_name,
              dataContext.middle_name,
              dataContext.last_name
            );
          }
          return name_string;
        },
      },
      /* {
        id: "middle_name",
        name: "Middle Name",
        field: "middle_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 55,
        filterable: true,
        filter: { model: Filters.compoundInput }
      },
      {
        id: "last_name",
        name: "Last Name",
        field: "last_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 55,
        filterable: true,
        filter: { model: Filters.compoundInput }
      }, */
      {
        id: "Mobile",
        name: this.translate.instant("Mobile"),
        field: "mobile_number",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Login",
        name: this.translate.instant("Login"),
        field: "login",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Email",
        name: this.translate.instant("Email"),
        field: "email",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Role",
        name: this.translate.instant("Role"),
        field: "roleprofile",
        type: FieldType.string,
        minWidth: 170,
        // filterable: true,
        // filter: { model: Filters.compoundInput },
        formatter: (
          row: number,
          cell: number,
          value: Array<RoleProfileModel>
        ) => {
          var roles: Array<String> = [];
          _.forEach(value, (v: RoleProfileModel) => {
            roles.push(v.display_text);
          });
          return roles.join(",");
        },
      },

      /*  {
         id: "enterprise",
         name: "Enterprise",
         field: "enterprise",
         formatter: (row: any, cell: any, value: any) => {
           var enterprise_name = `${value.display_text}`;
           return enterprise_name == "undefined" ? "" : enterprise_name;
         },
         sortable: false,
         minWidth: 120,
         maxWidth: 140,
         type: FieldType.string,
       },
       {
         id: "location",
         name: "Location",
         field: "location",
         formatter: (row: any, cell: any, value: any) => {
           var location_name = `${value.display_text}`;
           return location_name == "undefined" ? "" : location_name;
         },
         sortable: false,
         minWidth: 120,
         maxWidth: 140,
         type: FieldType.string,
       }, */
      {
        id: "When created",
        name: this.translate.instant("When created"),
        field: "created_on",
        sortable: true,
        minWidth: 110,
        type: FieldType.string,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var created_on_string = "";
          if (_.get(dataContext, "created_on", null) != null) {
            created_on_string = this.global_service.formatDateTime(
              dataContext.created_on
            );
          }
          return created_on_string;
        },
      },
      /*{
        id: "modified_on",
        name: "Last Modified",
        field: "modified_on",
        sortable: false,
        minWidth: 110,
        maxWidth: 120,
        type: FieldType.string,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var modified_on_string = "";
          if (_.get(dataContext, "modified_on", null) != null) {
            modified_on_string = moment(dataContext.modified_on).format(
              "MM-DD-YYYY"
            );
          }
          return modified_on_string;
        },
      },*/
    ];

    if (this.user_permission_guard.hasCanManageUsersPermission()) {
      this.user_list_grid_column_definitions.unshift(
        {
          name: `<i class="fa fa-pencil" style="color:#D3D3D3; cursor:pointer; justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
          field: "",
          id: 1,
          formatter: this.userEditButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if (!args.dataContext.is_factory && args.dataContext.is_active && this.selected_user_rows.length == 0)
              this.popupCommon("ACTIVE", args);
          },
        },
        // name: `<div> <i class="fa fa-trash" style="color:	#D3D3D3;cursor:pointer;text-align: center" title="deactivate/activate" aria-hidden="true"></i>
        // /<i class="fa fa-user-plus" style="color:green;cursor:pointer;" aria-hidden="true"></i></div>`,
        {
          name: `<span><i class="fa fa-trash" style="color:#D3D3D3;cursor:pointer; justify-align: center;" title="Deactivate/Activate"></i></span>`,
          field: "",
          id: 2,
          formatter: this.userDeleteButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if (
              !args.dataContext.is_factory &&
              this.selected_user_rows.length == 0
            )
              this.popupCommon("INACTIVE", args);
          },
        },
        {
          name: `<i class="fa fa-lock" style="color:	#D3D3D3;cursor:pointer;text-align: center" title="Lock/Unlock" aria-hidden="true"></i>`,
          field: "",
          id: 3,
          formatter: this.userLockButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if (args.dataContext.is_active) {
              this.popupCommon("LOCKED", args);
            }
          },
        }
      );
    }
    if (this.is_ldap_mode) {
      this.user_list_grid_column_definitions.push({
        id: "active_directory_dn",
        name: this.translate.instant("IDAP group"),
        field: "active_directory_dn",
        type: FieldType.string,
        sortable: true,
        minWidth: 170,
      });
    } else {
      this.user_list_grid_column_definitions.push({
        id: "When modified",
        name: this.translate.instant("When modified"),
        field: "modified_on",
        sortable: true,
        minWidth: 110,
        type: FieldType.string,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var modified_on_string = "";
          if (_.get(dataContext, "modified_on", null) != null) {
            modified_on_string = this.global_service.formatDateTime(
              dataContext.modified_on
            );
          }
          return modified_on_string;
        },
      });
    }
    // if (this.selected_user_filter.code == 'INACTIVE') {
    //   this.user_list_grid_column_definitions.push({
    //     name: "",
    //     field: "",
    //     id: "",
    //     formatter: this.userLockButtonFormat,
    //     minWidth: 30,
    //     maxWidth: 30,
    //     onCellClick: (e, args: OnEventArgs) => {
    //       this.popupCommon('LOCKED', args);
    //     }
    //   })
    // }
    this.user_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "user-list-grid-container",
        // sidePadding: 15,
      },
      // enableTranslate: true,
      // i18n: this.translate as any,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableAutoTooltip: true,
      checkboxSelector: {
        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true,
      },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      enableCheckboxSelector: true,
      enableRowSelection: true,
    };
  }
  goToUserMerge() {
    this.router.navigate(["usermerge"], { relativeTo: this.route });
  }
  gotoImportLDAPUsers() {
    this.router.navigate(["importldapusers"], { relativeTo: this.route });
  }
  editUser = () => {
    // debugger;
    var user = this.selected_user_rows[0];
    let navigation_extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        id: user.id,
        user_login: user.login,
        user_email: user.email,
        user_mobile_number: user.mobile_number,
        user_display_name: user.first_name,
        user_active_directory_dn: user.active_directory_dn,
      },
    };
    this.router.navigate(["usermerge"], navigation_extras);
  };
  deleteUser = () => {
    /*var seleted_users = _.map(this.selected_user_rows, (v) => {
      return this.user_list_grid_dataset[v];
    });*/
    var selected_users = this.selected_user_rows;
    var request = new ActionReq<Array<UserModel>>({
      item: selected_users,
    });
    this.users_alarm_service
      .deleteUser(request)
      .subscribe(
        (resp: ActionRes<Array<UserModel>>) => {
          if (resp.item.length > 0) {
            if (request.item[0].is_active == false) {
              this.toastr_service.success(
                this.translate.instant("User activated successfully")
              );
            }
            if (request.item[0].is_active == true) {
              this.toastr_service.success(
                this.translate.instant("User deactivated successfully")
              );
            }
            // this.toastr_service.success(
            //   this.translate.instant("User Activate/Deactivate sucessfull")
            // );
            this.getData();
          }
        },
        (err) => {
          this.toastr_service.error(
            this.translate.instant("Error in User Deletion")
          );
        }
      )
      .add(() => {
        this.unSelectUserRows();
        this.selected_user_rows = [];
        // this.getData();
      });
  };
  toggleSuspendUser() {
    var seleted_users = this.selected_user_rows;
    var request = new ActionReq<Array<UserModel>>({
      item: seleted_users,
    });
    this.users_alarm_service
      .toggleSuspendUser(request)
      .subscribe(
        (resp: ActionRes<Array<UserModel>>) => {
          if (resp.item.length > 0) {
            if (request.item[0].is_suspended == false) {
              this.toastr_service.success(
                this.translate.instant("User locked successfully")
              );
            }
            if (request.item[0].is_suspended == true) {
              this.toastr_service.success(
                this.translate.instant("User unlocked successfully")
              );
            }
            // this.toastr_service.success(
            //   this.translate.instant("User(s) Lock/Unlock sucessfull")
            // );
            this.getData();
          }
        },
        (err) => {
          this.toastr_service.error(
            this.translate.instant("Error in Lock/Unlock of User")
          );
        }
      )
      .add(() => {
        this.unSelectUserRows();
        this.getNativeorLDAPUsers();
        this.selected_user_rows = [];
        this.getData();
      });
  }
  popupCommon(e, args) {
    let isActive: boolean = false;
    let isSuspended: boolean = false;
    if (args == null) {
      isActive = this.selected_user_rows[0].is_active;
      isSuspended = this.selected_user_rows[0].is_suspended;
    } else {
      this.selected_user_rows = [args.dataContext];
      isActive = args.dataContext.is_active;
      isSuspended = args.dataContext.is_suspended;
    }
    if (e == "ACTIVE") {
      //edit
      this.editUser();
    }
    if (e == "INACTIVE") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // delete
          message: isActive
            ? this.translate.instant("Do you wish to proceed deactivate?")
            : this.translate.instant("Do you wish to proceed activate?"),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.deleteUser();
        }
      });
    }
    if (e == "LOCKED") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // lock/unlock
          message: isSuspended
            ? this.translate.instant("Do you wish to proceed unlock?")
            : this.translate.instant("Do you wish to proceed lock?"),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.toggleSuspendUser();
        }
      });
    }
  }
  usersListHandleSelectedRowsChanged(e, args) {
    // debugger;
    this.selected_user_rows = args.rows;
    if (Array.isArray(args.rows)) {
      this.selected_user_rows = args.rows.map((idx) => {
        const item = this.user_list_grid.getDataItem(idx);
        return item;
      });
    }
  }
  onUserFilterChange($event) {
    this.selected_user_filter = $event;
    this.getNativeorLDAPUsers();
    this.unSelectUserRows();
  }
  unSelectUserRows() {
    this.user_list_grid.setSelectedRows([]);
  }
  userEditButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      dataContext.is_factory ||
      this.selected_user_filter.code == "INACTIVE" ||
      this.selected_user_filter.code == "LOCKED"
    ) {
      return "";
    }
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    else
      return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
  };
  userDeleteButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      this.selected_user_filter.code == "ACTIVE" ||
      this.selected_user_filter.code == "LOCKED"
    ) {
      if (dataContext.is_factory) {
        return "";
      } else {
        return `<i class="fa fa-trash" style="color:red;cursor:pointer;text-align: right" aria-hidden="true"></i>`;
      }
    }
    if (this.selected_user_filter.code == "INACTIVE") {
      return `<i class="fas fa-trash-restore" style="color:green;cursor:pointer;" aria-hidden="true"></i>`;
    }
  };
  userLockButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    var data = dataContext;
    if (data.is_active) {
      if (
        data.is_suspended != true ||
        this.selected_user_filter.code == "ACTIVE" ||
        this.selected_user_filter.code == "INACTIVE"
      ) {
        if (data.is_active) {
          return `<i class="fa fa-lock" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
        } else {
          return "";
        }
      }
      if (this.selected_user_filter.code == "LOCKED") {
        return `<i class="fa fa-unlock-alt" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
      }
    } else return "";
  };
  userBulkDeactivateActivate() {
    this.popupCommon("INACTIVE", null);
  }
  userBulkUnlockLock() {
    this.popupCommon("LOCKED", null);
  }
}
