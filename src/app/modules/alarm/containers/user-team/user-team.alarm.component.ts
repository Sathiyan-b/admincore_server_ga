import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  OnEventArgs,
  Formatter,
} from "angular-slickgrid";
import { UserTeamAlarmService } from "./user-team.alarm.service";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { UserTeamModel } from "../../models/userteam.model";
import * as moment from "moment";
import * as _ from "lodash";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";

@Component({
  selector: "alarm-userteam",
  templateUrl: "./user-team.alarm.component.html",
  styleUrls: ["./user-team.alarm.component.css"],
})
export class UserTeamAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userTeam: UserTeamAlarmService,
    private alert_dialog: MatDialog,
    private toastr_service: ToastrService,
    public translate: TranslateService,
    private global_service: GlobalService,
    public user_permission_guard: UserPermissionGuardService
  ) {}

  ngOnInit() {
    this.getData();
    this.setupUserTeamListGrid();
  }
  // variables
  user_team_filter_list = [];
  selected_user_team_filter = null;
  selected_user_team_rows = [];
  delete = "INACTIVE";
  lock = "LOCKED";
  edit = "ACTIVE";
  // slick grid user team
  userteam_list_angular_grid: AngularGridInstance;
  userteam_list_grid: any;
  userteam_list_grid_service: GridService;
  userteam_list_grid_data_view: any;
  userteam_list_grid_column_definitions: Column[];
  userteam_list_grid_options: GridOption;
  userteam_list_grid_dataset: any = [];
  userteam_list_grid_updated_object: any;
  is_active: boolean = true;

  userTeamListGridReady(angularGrid: AngularGridInstance) {
    this.userteam_list_angular_grid = angularGrid;
    this.userteam_list_grid_data_view = angularGrid.dataView;
    this.userteam_list_grid = angularGrid.slickGrid;
    this.userteam_list_grid_service = angularGrid.gridService;
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
      this.userteam_list_angular_grid.extensionService.renderColumnHeaders(
        cols
      );
    });
  }
  getData = () => {
    /* get user types */
    this.user_team_filter_list = [
      {
        name: "active",
        code: "ACTIVE",
      },
      {
        name: "inactive",
        code: "INACTIVE",
      },
      /*, {
         name: "locked",
         code: "LOCKED",
       }*/
    ];
    this.selected_user_team_filter = this.user_team_filter_list[0];

    var request = new UserTeamModel();

    this.userTeam
      .getUserTeam(request)
      .subscribe((resp: ActionReq<Array<UserTeamModel>>) => {
        if (resp.item) {
          this.userteam_list_grid_dataset = resp.item;
        }
      });
  };

  setupUserTeamListGrid() {
    this.userteam_list_grid_column_definitions = [
      // {
      //   name: "",
      //   field: "",
      //   id: "",
      //   formatter: this.userTeamLockButtonFormat,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e, args: OnEventArgs) => {
      //     this.popupCommon('LOCKED', args);
      //   },
      // },
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
        id: "Team name",
        name: this.translate.instant("Team name"),
        field: "display_text",
        sortable: true,
        minWidth: 120,
        filterable: true,
      },
      {
        id: "Team purpose",
        name: this.translate.instant("Team purpose"),
        field: "team_purpose",
        sortable: true,
        minWidth: 120,
        filterable: true,
      },
      {
        id: "Start time",
        name: this.translate.instant("Start time"),
        field: "start_time",
        type: FieldType.string,
        sortable: true,
        minWidth: 80,
        filterable: true,
      },
      {
        id: "End time",
        name: this.translate.instant("End time"),
        field: "end_time",
        type: FieldType.string,
        sortable: true,
        minWidth: 80,
        filterable: true,
      },
      {
        id: "Members",
        name: this.translate.instant("Members"),
        field: "members_attribute",
        formatter: (row: any, cell: any, value: any) => {
          var memeber_list = [];
          if (value instanceof Array) {
            _.forEach(value, (v) => {
              let formatted_user = this.global_service.formatUsername(
                v.user_first_name,
                v.user_middle_name,
                v.user_last_name
              );
              memeber_list.push(formatted_user);
            });
          }
          return memeber_list.join(", ");
        },
        // sortable: true,
        minWidth: 200,
        // filterable: true,
        type: FieldType.string,
      },
      /*{
        id: "",
        name: "Escalation",
        field: "",
       
        sortable: true,
        minWidth: 200,
        filterable: true,
        type: FieldType.string,
      },*/
      {
        //name changes due to naming conversion "When_created"
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
        //name changes due to naming conversion "When_modified"
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
      },
    ];
    if (this.user_permission_guard.hasCanManageTeamsPermission()) {
      // if (this.selected_user_team_filter.code == "ACTIVE") {
      this.userteam_list_grid_column_definitions.unshift(
        {
          name: `<i class="fa fa-pencil" style="color:#D3D3D3; cursor:pointer; justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
          field: "",
          id: 1,
          formatter: this.userTeamEditButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if (args.dataContext.is_factory === false && args.dataContext.is_active) {
            this.popupCommon("ACTIVE", args);
            }
          },
        },
        {
          name: `<span><i class="fa fa-trash" style="color:#D3D3D3;cursor:pointer; justify-align: center;" title="Deactivate/Activate"></i></span>`,
          field: "",
          id: 2,
          formatter: this.userTeamDeleteButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            this.popupCommon("INACTIVE", args);
          },
        }
      );
      // }
      // else if (this.selected_user_team_filter.code == "INACTIVE") {
      //   this.userteam_list_grid_column_definitions.unshift(
      //     {
      //       name: `<i class="fa fa-pencil" style="color:	#D3D3D3; cursor:pointer; justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
      //       field: "",
      //       id: 1,
      //       formatter: this.userTeamEditButtonFormat,
      //       minWidth: 30,
      //       maxWidth: 35,
      //       onCellClick: (e, args: OnEventArgs) => {
      //         this.popupCommon("ACTIVE", args);
      //       },
      //     },
      //     {
      //       name: `<i class="fa fa-user-plus" style="color:	#D3D3D3;cursor:pointer;text-align: center" aria-hidden="true"></i>`,
      //       field: "",
      //       id: 2,
      //       formatter: this.userTeamDeleteButtonFormat,
      //       minWidth: 35,
      //       maxWidth: 35,
      //       onCellClick: (e, args: OnEventArgs) => {
      //         this.popupCommon("INACTIVE", args);
      //       },
      //     }
      //   );
      // }
    }
    this.userteam_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "userteam-list-grid-container",
        // sidePadding: 15,
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
      // enableCheckboxSelector: true, //this.permission.user.change_status || this.permission.user.manage,
      enableRowSelection: true,
    };
  }
  onUserTeamFilterChange($event) {
    this.selected_user_team_filter = $event;
    console.log(this.selected_user_team_filter);
    this.getNativeUserTeam();
    // this.unSelectUserTeamRows();
  }
  getNativeUserTeam() {
    var request = new UserTeamModel();
    request.is_factory = false;
    switch (this.selected_user_team_filter.code) {
      case "ACTIVE":
        request.is_active = true;
        break;
      case "INACTIVE":
        request.is_active = false;
        this.is_active = false;
        break;
      case "LOCKED":
        request.is_suspended = true;
        break;
      default:
        break;
    }
    this.userTeam
      .getUserTeam(request)
      .subscribe((resp: ActionRes<Array<UserTeamModel>>) => {
        if (resp.item) {
          this.userteam_list_grid_dataset = resp.item;
          this.userteam_list_grid_service.renderGrid();
          // this.setupUserTeamListGrid();
          // this.userteam_list_grid_service
        }
      });
  }
  userTeamListHandleSelectedRowsChanged(e, args) {
    // debugger;
    //this.selected_user_team_rows = args.rows;
    if (Array.isArray(args.rows)) {
      this.selected_user_team_rows = args.rows.map((idx) => {
        const item = this.userteam_list_grid.getDataItem(idx);
        return item;
      });
    }
  }
  unSelectUserTeamRows() {
    this.userteam_list_grid.setSelectedRows([]);
  }
  goToUserTeamMerge() {
    this.router.navigate(["user-team-merge"], { relativeTo: this.route });
  }
  popupCommon(e, args) {
    if (args) {
      this.selected_user_team_rows = [args.dataContext];
    }
    if (e == "ACTIVE") {
      //edit
      this.editUserTeam();
    }
    // if (e == 'LOCKED') {
    //   const alert = this.alert_dialog.open(PopupCommonComponent, {
    //     data: { // lock/unlock
    //       message: `Do you wish to proceed Lock/Unlock?`
    //     }
    //   });
    //   alert.afterClosed().subscribe((can_Delete) => {
    //     if (can_Delete) {
    //       this.toggleSuspendUserTeam();
    //     }
    //   })
    // }
    if (e == "INACTIVE") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // delete
          message: args.dataContext.is_active
            ? this.translate.instant("This will dissociate the Team from the associated Point of Care(s). Do you wish to proceed?")
            : this.translate.instant("Do you wish to proceed activate?"),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.deleteUserTeam();
        }
      });
    }
  }
  editUserTeam = () => {
    var userteam = this.selected_user_team_rows[0]; //this.userteam_list_grid_dataset[this.selected_user_team_rows[0]];
    console.log("user team:", userteam);
    let navigation_extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        id: userteam.id,
      },
    };
    this.router.navigate(["user-team-merge"], navigation_extras);
  };
  deleteUserTeam = () => {
    var seleted_user_team = this.selected_user_team_rows;

    var request = new ActionReq<Array<UserTeamModel>>({
      item: seleted_user_team,
    });
    this.userTeam
      .deleteUserTeam(request)
      .subscribe(
        (resp: ActionRes<Array<UserTeamModel>>) => {
          if (resp.item.length > 0) {
            if (request.item[0].is_active == false) {
              this.toastr_service.success(
                this.translate.instant("User Team activated successfully")
              );
            }
            if (request.item[0].is_active == true) {
              this.toastr_service.success(
                this.translate.instant("User Team deactivated successfully")
              );
            }
            // this.getData();
          }
        },
        (error) => {
          var error_msg =
            error && error.error && error.error.message
              ? error.error.message
              : "";
          this.toastr_service.error(
            error_msg.length > 0 ? error_msg : "Error in User Team delete"
          );
        }
      )
      .add(() => {
        this.unSelectUserTeamRows();
        this.getNativeUserTeam();
      });
  };
  // toggleSuspendUserTeam = () => {
  //   /*var seleted_user_team = _.map(this.selected_user_team_rows, (v) => {
  //     return this.userteam_list_grid_dataset[v];
  //   });*/
  //   var seleted_user_team = this.selected_user_team_rows;

  //   var request = new ActionReq<Array<UserTeamModel>>({
  //     item: seleted_user_team,
  //   });
  //   console.log("toggle suspend :", request);
  //   this.
  //     userTeam.toggleSuspendUserTeam(request)
  //     .subscribe(
  //       (resp: ActionRes<Array<UserTeamModel>>) => {
  //         if (resp.item.length > 0) {
  //           this.toastr_service.success("User Team(s) Lock/Unlock sucessfull");
  //           // this.getData();
  //         }
  //       },
  //       (err) => {
  //         this.toastr_service.error("Error in Lock/Unlock of User Team(s)");
  //       }
  //     )
  //     .add(() => {
  //       this.unSelectUserTeamRows();
  //       this.getNativeUserTeam();
  //     })
  // }
  userTeamEditButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      dataContext.is_factory ||
      this.selected_user_team_filter.code == "INACTIVE"
    ) {
      return ``;
    }
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    else
      return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
  };
  userTeamDeleteButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      this.selected_user_team_filter.code == "ACTIVE" ||
      this.selected_user_team_filter.code == "LOCKED"
    ) {
      return `<i class="fa fa-trash" style="color:red;cursor:pointer;text-align: center" aria-hidden="true"></i>`;
    }
    if (this.selected_user_team_filter.code == "INACTIVE") {
      return `<i class="fas fa-trash-restore" style="color:green;cursor:pointer;" aria-hidden="true"></i>`;
    }
  };
  userTeamLockButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      this.selected_user_team_filter.code == "ACTIVE" ||
      this.selected_user_team_filter.code == "INACTIVE"
    ) {
      return `<i class="fa fa-lock" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
    }
    if (this.selected_user_team_filter.code == "LOCKED") {
      return `<i class="fa fa-unlock-alt" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
    }
  };
}
