import { Component, OnInit } from "@angular/core";
import {
  Formatter,
  FieldType,
  Filters,
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  OnEventArgs,
} from "angular-slickgrid";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { RoleProfileModel } from "../../models/roleprofile.model";
import { RolesAlarmService } from "./roles.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import * as _ from "lodash";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { MatDialog } from "@angular/material/dialog";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { data } from "jquery";
import { TranslateService } from "@ngx-translate/core";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";
@Component({
  selector: "alarm-roles",
  styleUrls: ["./roles.alarm.component.css"],
  templateUrl: "./roles.alarm.component.html",
})
export class RolesAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private role_alarm_service: RolesAlarmService,
    private toastr_service: ToastrService,
    private global_service: GlobalService,
    private alert_dialog: MatDialog,
    public translate: TranslateService,
    public user_permission_guard: UserPermissionGuardService
  ) {}
  ngOnInit() {
    this.getData();
    this.setupRoleListGrid();
  }
  // variables
  permission: any = {};
  role_filter_list = [];
  selected_role_filter = null;
  selected_role_rows = [];
  delete = "INACTIVE";
  lock = "LOCKED";
  edit = "ACTIVE";
  Date_format: string = "";
  // slick grid
  role_list_angular_grid: AngularGridInstance;
  role_list_grid: any;
  role_list_grid_service: GridService;
  role_list_grid_data_view: any;
  role_list_grid_column_definitions: Column[];
  role_list_grid_options: GridOption;
  role_list_grid_dataset: Array<RoleProfileModel> = [];
  role_list_grid_updated_object: any;
  PermissFlag = 0;
  /*
1 --  Manage
2 --- change_status
3 --- View
*/
  getData() {
    // this.getDateFormat();
    /* permissions */
    this.permission = this.global_service.permission_object;
    if (
      this.global_service.user_data.user_type_id == 0 ||
      this.permission.roleprofile.manage == true
    ) {
      this.PermissFlag = 1;
    } else if (this.permission.roleprofile.change_status == true) {
      this.PermissFlag = 2;
    } else if (this.permission.roleprofile.view == true) {
      this.PermissFlag = 3;
    }

    /* get user types */
    this.role_filter_list = [
      {
        name: "active",
        code: "ACTIVE",
      },
      {
        name: "inactive",
        code: "INACTIVE",
      },
    ];
    this.selected_role_filter = this.role_filter_list[0];

    this.getRoles();
  }

  // getDateFormat() {
  //   var date_format = [];
  //   date_format = this.global_service.global_value;
  //   var index = date_format.findIndex(v=>{
  //     return v.key == "GLOBAL";
  //   });
  //   console.log("re",date_format[index].datetime_format)
  //   this.Date_format = date_format[index].datetime_format;
  // }

  getRoles() {
    var request = new RoleProfileModel();

    switch (this.selected_role_filter.code) {
      case "ACTIVE":
        request.is_active = true;
        break;
      case "INACTIVE":
        request.is_active = false;
        break;
      default:
        break;
    }

    // console.log(
    //   "this.permission.roleprofile.manage",
    //   this.permission.roleprofile.manage
    // );

    this.role_alarm_service.getRoleProfiles(request).subscribe(
      (resp: ActionRes<Array<RoleProfileModel>>) => {
        if (resp.item) {
          //this.role_list_grid_dataset = resp.item;
          this.role_list_grid_dataset = _.sortBy(resp.item, "name");
          this.role_list_grid_service.renderGrid();
        }
      },
      (error) => {
        this.toastr_service.error(
          this.translate.instant("Error on loading Roles")
        );
      }
    );
  }

  roleListGridReady(angularGrid: AngularGridInstance) {
    this.role_list_angular_grid = angularGrid;
    this.role_list_grid_data_view = angularGrid.dataView;
    this.role_list_grid = angularGrid.slickGrid;
    this.role_list_grid_service = angularGrid.gridService;
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
      this.role_list_angular_grid.extensionService.renderColumnHeaders(cols);
    });
  }
  async onRoleListGridCellChanged(e, args) {
    this.role_list_grid_updated_object = args.item;
    // this.role_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupRoleListGrid() {
    this.role_list_grid_column_definitions = [
      {
        name: "#",
        field: "",
        id: 3,
        formatter: function (row) {
          return (row + 1).toString();
        },
        width: 40,
      },
      {
        id: "Name",
        name: this.translate.instant("Name"),
        field: "display_text",
        type: FieldType.string,
        sortable: true,
        minWidth: 140,
        filterable: true,
        filter: { model: Filters.compoundInput },
        // formatter: (
        //   row: number,
        //   cell: number,
        //   value: any,
        //   columnDef: Column,
        //   dataContext: any,
        //   grid?: any
        // ) => {
        //   var root_user_format = "";
        //   if (_.get(dataContext, "display_text", null) != null) {
        //     root_user_format = this.global_service.formatrootuser(dataContext.display_text);
        //   }
        //   return root_user_format;
        // },
      },
      {
        id: "Purpose",
        name: this.translate.instant("Purpose"),
        field: "purpose",
        type: FieldType.string,
        sortable: true,
        minWidth: 140,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      /*{
        id: "enterprise",
        name: "Enterprise",
        field: "enterprise",
        formatter: (row: any, cell: any, value: any) => {
          var enterprise_name = `${value.display_text}`;
          return enterprise_name == "undefined" ? "" : enterprise_name;
        },
        sortable: false,
        minWidth: 120, maxWidth: 140,
        type: FieldType.string
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
        minWidth: 120, maxWidth: 140,
        type: FieldType.string
      },*/
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
      {
        id: "When_modified",
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
      },
    ];
    // if (this.hasCanManageRoleProfilePermission()) {
    // if (this.selected_role_filter.code == "ACTIVE") {
      this.role_list_grid_column_definitions.unshift(
        {
          name: `<i class="fa fa-pencil" style="color:#D3D3D3; cursor:pointer; justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
          field: "",
          id: 1,
          formatter: this.roleEditButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if (!args.dataContext.is_factory && args.dataContext.is_active) this.popupCommon("ACTIVE", args);
          },
        },
        {
          name: `<span><i class="fa fa-trash" style="color:#D3D3D3;cursor:pointer; justify-align: center;" title="Deactivate/Activate"></i></span>`,
          field: "",
          id: 2,
          formatter: this.roleDeleteButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if (!args.dataContext.is_factory)
              this.popupCommon("INACTIVE", args);
          },
        }
      );
  //   }
  // }
    // else if(this.selected_role_filter.code == "INACTIVE") {
    //   this.role_list_grid_column_definitions.unshift(
    //     {
    //       name: `<i class="fa fa-pencil" style="color:#D3D3D3; cursor:pointer; justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
    //       field: "",
    //       id: 1,
    //       formatter: this.roleEditButtonFormat,
    //       minWidth: 30,
    //       maxWidth: 30,
    //       onCellClick: (e, args: OnEventArgs) => {
    //         if (!args.dataContext.is_factory) this.popupCommon("ACTIVE", args);
    //       },
    //     },
    //     {
    //       name: "",
    //       field: "",
    //       id: 2,
    //       formatter: this.roleDeleteButtonFormat,
    //       minWidth: 35,
    //       maxWidth: 35,
    //       onCellClick: (e, args: OnEventArgs) => {
    //         if (!args.dataContext.is_factory)
    //           this.popupCommon("INACTIVE", args);
    //       },
    //     }
    //   );
    // }
    if (this.global_service.auth_mode == "LDAP") {
      this.role_list_grid_column_definitions.splice(2, 0, {
        id: "LDAP group",
        name: this.translate.instant("LDAP group"),
        field: "ldap_config",
        type: FieldType.string,
        sortable: true,
        minWidth: 220,
        filterable: true,
        // maxWidth:150
      });
    }
    this.role_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "role-list-grid-container",
        // sidePadding: 5
      },
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
      enableCheckboxSelector: this.PermissFlag == 1 || this.PermissFlag == 2,
      enableRowSelection: this.PermissFlag == 1 || this.PermissFlag == 2,
    };
  }
  editRole = () => {
    /*var selected_role = _.map(this.selected_role_rows, (v) => {
      return this.role_list_grid_dataset[v];
    });*/

    var selected_role = this.selected_role_rows;

    let navigation_extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        id: selected_role[0].id,
      },
    };
    this.router.navigate(["rolemerge"], navigation_extras);
  };
  deleteRole = () => {
    /*var selected_role = _.map(this.selected_role_rows, (v) => {
      return this.role_list_grid_dataset[v];
    });*/
    var selected_role = this.selected_role_rows;

    var request = new ActionReq<Array<RoleProfileModel>>({
      item: selected_role,
    });
    this.role_alarm_service
      .deleteRole(request)
      .subscribe(
        (resp: ActionRes<Array<RoleProfileModel>>) => {
          if (resp.item.length > 0) {
            if (request.item[0].is_active == false) {
              this.toastr_service.success(
                this.translate.instant("Role activated successfully")
              );
            }
            if (request.item[0].is_active == true) {
              this.toastr_service.success(
                this.translate.instant("Role deactivated successfully")
              );
            }
            // this.toastr_service.success(
            //   this.translate.instant("Role Activate/Deactivate successful")
            // );
            this.getRoles();
          }
        },
        (err) => {
          this.toastr_service.error(
            this.translate.instant("Error in Role Deletion")
          );
        }
      )
      .add(() => {
        this.unSelectRoleRows();
        // this.getNativeUsers();
      });
  };
  toggleSuspendRole = () => {
    /* var selected_role = _.map(this.selected_role_rows, (v) => {
       return this.role_list_grid_dataset[v];
     });*/
    var selected_role = this.selected_role_rows;
    var request = new ActionReq<Array<RoleProfileModel>>({
      item: selected_role,
    });
    this.role_alarm_service
      .toggleSuspendRole(request)
      .subscribe(
        (resp: ActionRes<Array<RoleProfileModel>>) => {
          if (resp.item.length > 0) {
            if (request.item[0].is_suspended == false) {
              this.toastr_service.success(
                this.translate.instant("Role locked successfully")
              );
            }
            if (request.item[0].is_suspended == true) {
              this.toastr_service.success(
                this.translate.instant("Role unlocked successfully")
              );
            }
            // this.toastr_service.success(
            //   this.translate.instant("Role(s) Lock/Unlock successful")
            // );
            this.getData();
          }
        },
        (err) => {
          this.toastr_service.error(
            this.translate.instant("Error in Lock/Unlock of Role(s)")
          );
        }
      )
      .add(() => {
        this.unSelectRoleRows();
        // this.getNativeUsers();
      });
  };
  unSelectRoleRows() {
    this.role_list_grid.setSelectedRows([]);
  }
  // getNativeUsers() {
  //   var request = new UserModel();
  //   request.user_type = this.is_ldap_mode ? 1 : 0;
  //   switch (this.selected_user_filter.code) {
  //     case "ACTIVE":
  //       request.is_active = true;
  //       break;
  //     case "INACTIVE":
  //       request.is_active = false;
  //       break;
  //     case "LOCKED":
  //       request.is_suspended = true;
  //       break;
  //     default:
  //       break;
  //   }
  // }
  roleEditButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      dataContext.is_factory ||
      this.selected_role_filter.code == "INACTIVE"
    ) {
      return ``;
    }
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    else
      return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
  };
  roleDeleteButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (dataContext.is_factory) {
      return ``;
    } else if (
      this.selected_role_filter.code == "ACTIVE" ||
      this.selected_role_filter.code == "LOCKED"
    ) {
      return `<i class="fa fa-trash" style="color:red;cursor:pointer;text-align: center" aria-hidden="true"></i>`;
    }
    if (this.selected_role_filter.code == "INACTIVE") {
      return `<i class="fas fa-trash-restore" style="color:green;cursor:pointer;" aria-hidden="true"></i>`;
    }
  };
  // roleLockButtonFormat: Formatter = (
  //   row,
  //   cell,
  //   value,
  //   columnDef,
  //   dataContext
  // ) => {
  //   if (this.selected_role_filter.code == 'ACTIVE' || this.selected_role_filter.code == 'INACTIVE') {
  //     return `<i class="fa fa-lock" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
  //   }
  //   if (this.selected_role_filter.code == 'LOCKED') {
  //     return `<i class="fa fa-unlock-alt" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
  //   }
  // }
  roleListHandleSelectedRowsChanged(e, args) {
    //this.selected_role_rows = args.rows;
    if (Array.isArray(args.rows)) {
      this.selected_role_rows = args.rows.map((idx) => {
        const item = this.role_list_grid.getDataItem(idx);
        return item;
      });
    }
  }
  goToRolerMerge() {
    this.router.navigate(["rolemerge"], { relativeTo: this.route });
  }
  popupCommon(e, args) {
    if (args) {
      this.selected_role_rows = [args.dataContext];
    }
    if (e == "ACTIVE") {
      // edit
      this.editRole();
    }
    if (e == "INACTIVE") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // delete
          message: args.dataContext.is_active
            ? this.translate.instant("Do you wish to proceed deactivate?")
            : this.translate.instant("Do you wish to proceed activate?"),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.deleteRole();
        }
      });
    }
    // if (e == 'LOCKED') {
    //   const alert = this.alert_dialog.open(PopupCommonComponent, {
    //     data: { // lock/unlock
    //       message: `Do you wish to proceed Lock/Unlock ?`
    //     }
    //   });
    //   alert.afterClosed().subscribe((can_Lock) => {
    //     if (can_Lock) {
    //       console.log("can_Lock: ", can_Lock);
    //       this.toggleSuspendRole();
    //     }
    //   })
    // }
  }

  onUserFilterChange($event) {
    this.selected_role_filter = $event;
    this.getRoles();
    this.unSelectRoleRows();
  }
}
