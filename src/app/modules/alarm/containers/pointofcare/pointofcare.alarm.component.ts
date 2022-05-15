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
import { PointofcareAlarmService } from "./pointofcare.alarm.service";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import {
  PointofcareEscalationModel,
  PointofcareModel,
  PointofcareUserModel,
} from "../../models/pointofcare.model";
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
  selector: "alarm-pointofcare",
  templateUrl: "./pointofcare.alarm.component.html",
  styleUrls: ["./pointofcare.alarm.component.css"],
})
export class PointofcareAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pointofcare: PointofcareAlarmService,
    private alert_dialog: MatDialog,
    private toastr_service: ToastrService,
    public translate: TranslateService,
    private global_service: GlobalService,
    public user_permission_guard: UserPermissionGuardService
  ) {}

  ngOnInit() {
    this.getData();
    this.setupPointofcareListGrid();
  }
  // variables
  pointofcare_filter_list = [];
  selected_pointofcare_filter = null;
  selected_pointofcare_rows = [];
  delete = "INACTIVE";
  lock = "LOCKED";
  edit = "ACTIVE";
  // slick grid user team
  pointofcare_list_angular_grid: AngularGridInstance;
  pointofcare_list_grid: any;
  pointofcare_list_grid_service: GridService;
  pointofcare_list_grid_data_view: any;
  pointofcare_list_grid_column_definitions: Column[];
  pointofcare_list_grid_options: GridOption;
  pointofcare_list_grid_dataset: any = [];
  pointofcare_list_grid_updated_object: any;

  pointofcareListGridReady(angularGrid: AngularGridInstance) {
    this.pointofcare_list_angular_grid = angularGrid;
    this.pointofcare_list_grid_data_view = angularGrid.dataView;
    this.pointofcare_list_grid = angularGrid.slickGrid;
    this.pointofcare_list_grid_service = angularGrid.gridService;
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
      this.pointofcare_list_angular_grid.extensionService.renderColumnHeaders(
        cols
      );
    });
  }
  getData = () => {
    /* get user types */
    this.pointofcare_filter_list = [
      {
        name: "active",
        code: "ACTIVE",
      },
      {
        name: "inactive",
        code: "INACTIVE",
      },
    ];
    this.selected_pointofcare_filter = this.pointofcare_filter_list[0];

    var request: ActionReq<PointofcareModel> = new ActionReq<PointofcareModel>({
      item: new PointofcareModel({
        is_active: true,
      }),
    });
    this.pointofcare
      .getPointofcare(request)
      .subscribe((resp: ActionReq<Array<PointofcareModel>>) => {
        if (resp.item) {
          this.pointofcare_list_grid_dataset = resp.item;
        }
      });
  };
  setupPointofcareListGrid() {
    this.pointofcare_list_grid_column_definitions = [
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
        id: "Shortname",
        name: this.translate.instant("Shortname"),
        field: "identifier",
        sortable: true,
        minWidth: 120,
        filterable: true,
      },
      {
        id: "Name",
        name: this.translate.instant("Name"),
        field: "display_text",
        sortable: true,
        minWidth: 120,
        filterable: true,
      },
      // {
      //   id: "Purpose",
      //   name: this.translate.instant("Purpose"),
      //   field: "purpose",
      //   sortable: true,
      //   minWidth: 120,
      //   filterable: true,
      // },
      {
        id: "Subscribers",
        name: this.translate.instant("Subscribers"),
        field: "users_attribute",
        sortable: true,
        minWidth: 200,
        filterable: true,
        type: FieldType.string,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var subscriber_list: Array<PointofcareUserModel> = value ? value : [];
          var name_array = _.map(subscriber_list, (v) => {
            let formatted_name = this.global_service.formatUsername(
              v.user_first_name,
              v.user_middle_name,
              v.user_last_name
            );
            return formatted_name;
          });

          return name_array.join(",");
        },
      },
      {
        id: "Escalation",
        name: this.translate.instant("Escalation"),
        field: "escalation_attribute",
        // sortable: true,
        minWidth: 200,
        // filterable: true,
        type: FieldType.string,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var escalation_list: Array<PointofcareEscalationModel> = value
            ? value
            : [];
          var name_array = _.map(escalation_list, (v) => {
            return (v as any).name;
          });

          return name_array.join(",");
        },
      },
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
    if (this.user_permission_guard.hasCanManagePointofCarePermission()) {
      this.pointofcare_list_grid_column_definitions.unshift(
        {
          name: `<i class="fa fa-pencil" style="color:#D3D3D3; cursor:pointer; justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
          field: "",
          id: 1,
          formatter: this.pointofcareEditButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if(!args.dataContext.is_factory && args.dataContext.is_active) {
              this.popupCommon("ACTIVE", args);
            }
          },
        },
        {
          name: `<span><i class="fa fa-trash" style="color:#D3D3D3;cursor:pointer; justify-align: center;" title="Deactivate/Activate"></i></span>`,
          field: "delete",
          id: 2,
          formatter: this.pointofcareDeleteButtonFormat,
          minWidth: 30,
          maxWidth: 35,
          onCellClick: (e, args: OnEventArgs) => {
            if(!args.dataContext.is_factory)  this.popupCommon("INACTIVE", args);
          },
        }
      );
    }
    this.pointofcare_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "pointofcare-list-grid-container",
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
  onPointofcareFilterChange($event) {
    this.selected_pointofcare_filter = $event;
    this.getNativePointofcare();
    this.unSelectPointofcareRows();
  }
  getNativePointofcare() {
    var pointofcare = new PointofcareModel();
    pointofcare.is_factory = false;
    switch (this.selected_pointofcare_filter.code) {
      case "ACTIVE":
        pointofcare.is_active = true;
        break;
      case "INACTIVE":
        pointofcare.is_active = false;
        break;
      case "LOCKED":
        pointofcare.is_suspended = true;
        break;
      default:
        break;
    }
    var request: ActionReq<PointofcareModel> = new ActionReq<PointofcareModel>({
      item: pointofcare,
    });
    this.pointofcare
      .getPointofcare(request)
      .subscribe((resp: ActionRes<Array<PointofcareModel>>) => {
        if (resp.item) {
          this.pointofcare_list_grid_dataset = resp.item;
          this.pointofcare_list_grid_service.renderGrid();
        }
      });
  }
  pointofcareListHandleSelectedRowsChanged(e, args) {
    // debugger;
    //this.selected_pointofcare_rows = args.rows;
    if (Array.isArray(args.rows)) {
      this.selected_pointofcare_rows = args.rows.map((idx) => {
        const item = this.pointofcare_list_grid.getDataItem(idx);
        return item;
      });
    }
  }
  unSelectPointofcareRows() {
    this.pointofcare_list_grid.setSelectedRows([]);
  }
  goToPointofcareMerge() {
    this.router.navigate(["pointofcare-merge"], { relativeTo: this.route });
  }
  popupCommon(e, args) {
    if (args) {
      this.selected_pointofcare_rows = [args.dataContext];
    }
    if (e == "ACTIVE") {
      //edit
      this.editPointofcare();
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
          this.deletePointofcare();
        }
      });
    }
  }
  editPointofcare = () => {
    var pointofcare = this.selected_pointofcare_rows[0]; //this.pointofcare_list_grid_dataset[this.selected_pointofcare_rows[0]];
    let navigation_extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        id: pointofcare.id,
      },
    };
    this.router.navigate(["pointofcare-merge"], navigation_extras);
  };
  deletePointofcare = () => {
    var seleted_pointofcare = this.selected_pointofcare_rows;

    var request = new ActionReq<Array<PointofcareModel>>({
      item: seleted_pointofcare,
    });
    this.pointofcare
      .deletePointofcare(request)
      .subscribe(
        (resp: ActionRes<Array<PointofcareModel>>) => {
          if (resp.item.length > 0) {
            if (request.item[0].is_active == false) { 
              this.toastr_service.success(
                this.translate.instant("Point of Care activated successfully")
              );
            }
            if (request.item[0].is_active == true) {
              this.toastr_service.success(
                this.translate.instant("Point of Care deactivated successfully")
              );
            }
          }
        },
        (err) => {
          this.toastr_service.error(
            this.translate.instant("Error in Point of Care Deletion")
          );
        }
      )
      .add(() => {
        this.unSelectPointofcareRows();
        this.getNativePointofcare();
      });
  };
  pointofcareEditButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      dataContext.is_factory ||
      this.selected_pointofcare_filter.code == "INACTIVE"
    ) {
      return ``;
    }
    else
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
  };
  pointofcareDeleteButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      this.selected_pointofcare_filter.code == "ACTIVE" ||
      this.selected_pointofcare_filter.code == "LOCKED"
    ) {
      return `<i class="fa fa-trash" style="color:red;cursor:pointer;text-align: center" aria-hidden="true"></i>`;
    }
    if (this.selected_pointofcare_filter.code == "INACTIVE") {
      return `<i class="fas fa-trash-restore" style="color:green;cursor:pointer;" aria-hidden="true"></i>`;
    }
  };
  pointofcareLockButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (
      this.selected_pointofcare_filter.code == "ACTIVE" ||
      this.selected_pointofcare_filter.code == "INACTIVE"
    ) {
      return `<i class="fa fa-lock" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
    }
    if (this.selected_pointofcare_filter.code == "LOCKED") {
      return `<i class="fa fa-unlock-alt" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
    }
  };

  async onPointofcareGridCellChanged(e, args) {
    this.pointofcare_list_grid_updated_object = args.item;
  }
}
