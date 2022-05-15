import { Component, OnInit } from "@angular/core";
import { ImportLdapUsersAlarmService } from "./import-ldap-users.alarm.service";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
} from "angular-slickgrid";
import { Location } from "@angular/common";
import ActionRes from "src/app/modules/global/model/actionres.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserModel } from "../../models/user.model";
import * as _ from "lodash";
import { forkJoin, of } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";
import { ReferenceListModel } from "../../models/referencelist.model";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
@Component({
  selector: "alarm-import-ldap-users",
  templateUrl: "./import-ldap-users.alarm.component.html",
  styleUrls: ["./import-ldap-users.alarm.component.css"],
})
export class ImportLdapUsersAlarmComponent implements OnInit {
  constructor(
    private import_ldap_users_service: ImportLdapUsersAlarmService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr_service: ToastrService,
    private location: Location,
    private global_service: GlobalService
  ) {}
  ngOnInit() {
    this.setupLDAPUserListGrid();
    this.getData();
  }
  /* variables */
  selected_user_rows = [];
  user_type_list = [];
  /* slick grid */
  user_ldap_list_angular_grid: AngularGridInstance;
  user_ldap_list_grid: any;
  user_ldap_list_grid_service: GridService;
  user_ldap_list_grid_data_view: any;
  user_ldap_list_grid_column_definitions: Column[];
  user_ldap_list_grid_options: GridOption;
  user_ldap_list_grid_dataset: any[];
  user_ldap_list_grid_updated_object: any;

  getData() {
    forkJoin([this.getUserTypeList(), this.getLdapUserList()]).subscribe(
      (resp) => {
        this.user_type_list = resp[0];
        var ldap_user_list = resp[1];
        // this.user_list_grid_dataset = resp[1];
        var user_type_obj: ReferenceListModel = _.find(
          this.user_type_list,
          (v: ReferenceListModel) => {
            return v.identifier == "AD";
          }
        );
        if (user_type_obj != undefined) {
          this.import_ldap_users_service
            .getUsers(new UserModel({ user_type_id: user_type_obj.id }))
            .subscribe(
              (resp: ActionRes<Array<UserModel>>) => {
                if (resp.item.length > 0) {
                  var user_list = resp.item;
                  this.user_ldap_list_grid_dataset = _.differenceBy(
                    ldap_user_list,
                    user_list,
                    "active_directory_dn"
                  );
                } else {
                  this.user_ldap_list_grid_dataset = ldap_user_list;
                }
              },
              (err) => {
                this.toastr_service.error(
                  "Error getting Directory Users' list"
                );
              }
            );
        }
      }
    );
  }
  getLdapUserList() {
    var request = new ActionReq<any>({
      item: {},
    });
    return this.import_ldap_users_service.getLDAPUsers(request).pipe(
      switchMap((resp: ActionRes<Array<UserModel>>) => {
        var ldap_user_list = [];
        if (resp.item.length > 0) {
          ldap_user_list = resp.item;
          _.forEach(ldap_user_list, (v, k) => {
            v.id = k + 1;
          });
        }
        return of(ldap_user_list);
      }),
      catchError((err) => {
        this.toastr_service.error("Error getting Directory Users' list");
        throw err;
      })
    );
  }

  getUserTypeList() {
    /* get user type list */
    return this.import_ldap_users_service.getReferenceList("USER_TYPE").pipe(
      switchMap((resp: ActionRes<Array<ReferenceListModel>>) => {
        var user_type_list = [];
        if (resp.item.length > 0) {
          user_type_list = resp.item;
        }
        return of(user_type_list);
      }),
      catchError((err) => {
        this.toastr_service.error("Error in getting User Type Reference data");
        throw err;
      })
    );
  }
  userLDAPListGridReady(angularGrid: AngularGridInstance) {
    this.user_ldap_list_angular_grid = angularGrid;
    this.user_ldap_list_grid_data_view = angularGrid.dataView;
    this.user_ldap_list_grid = angularGrid.slickGrid;
    this.user_ldap_list_grid_service = angularGrid.gridService;
  }
  async onUserLDAPListGridCellChanged(e, args) {
    this.user_ldap_list_grid_updated_object = args.item;
    // this.user_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupLDAPUserListGrid() {
    this.user_ldap_list_grid_column_definitions = [
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
        id: "f_name",
        name: "First Name",
        field: "f_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        // maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "mobile_number",
        name: "Mobile",
        field: "mobile_number",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        // maxWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "login",
        name: "Login",
        field: "login",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        // maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "email",
        name: "Email",
        field: "email",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        // maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "active_directory_dn",
        name: "AD DN",
        field: "active_directory_dn",
        type: FieldType.string,
        sortable: true,
        minWidth: 300,
        // maxWidth: 350,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      /* {
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
      }, 
      {
        id: "created_on",
        name: "User since",
        field: "created_on",
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
          var created_on_string = "";
          if (_.get(dataContext, "created_on", null) != null) {
            created_on_string = moment(dataContext.created_on).format(
              "MM-DD-YYYY"
            );
          }
          return created_on_string;
        },
      },
      {
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
      }, */
    ];
    this.user_ldap_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "user-ldap-list-grid-container",
        // sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
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

  usersLDAPListHandleSelectedRowsChanged(e, args) {
    this.selected_user_rows = args.rows;
  }

  unSelectUserRows() {
    this.user_ldap_list_grid.setSelectedRows([]);
  }
  importUsers() {
    var user_type_obj: ReferenceListModel = _.find(
      this.user_type_list,
      (v: ReferenceListModel) => {
        return v.identifier == "AD";
      }
    );
    var user_list = _.map(this.selected_user_rows, (v) => {
      var user: UserModel = this.user_ldap_list_grid_dataset[v];
      user.user_type_id =
        this.global_service.app_settings.auth_mode === "LDAP" ? 1 : 2;
      user.app_id = -1;
      return user;
    });
    var request = new ActionReq<Array<UserModel>>({
      item: user_list,
    });
    this.import_ldap_users_service.saveUsers(request).subscribe(
      (resp: ActionRes<Array<UserModel>>) => {
        this.toastr_service.success("Directory Users imported successfully");
        this.location.back();
      },
      (err) => {
        this.toastr_service.error("Error in importing Directory Users");
      }
    );
  }

  cancel() {
    // let navigation_extras: NavigationExtras = {
    //   queryParams: {
    //     is_active: true,
    //     is_suspended: false,
    //     user_type_id: 1, // this.global_service.user_data.user_type_id,
    //   },
    // };
    this.router.navigate(["alarm/accesscontrol"]);
  }
}
