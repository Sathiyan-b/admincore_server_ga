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
import { EnterpriseAlarmService } from "./enterprise.alarm.service";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { EnterpriseModel } from "../../models/enterprise.model";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import * as _ from "lodash";
@Component({
  selector: "alarm-enterprise",
  templateUrl: "./enterprise.alarm.component.html",
  styleUrls: ["./enterprise.alarm.component.css"],
})
export class EnterpriseAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private enterprise_alarm_service: EnterpriseAlarmService
  ) {}

  ngOnInit() {
    this.setupEnterpriseListGrid();
    this.getData();
  }

  // slick grid
  enterprise_list_angular_grid: AngularGridInstance;
  enterprise_list_grid: any;
  enterprise_list_grid_service: GridService;
  enterprise_list_grid_data_view: any;
  enterprise_list_grid_column_definitions: Column[];
  enterprise_list_grid_options: GridOption;
  enterprise_list_grid_dataset: any[];
  enterprise_list_grid_updated_object: any;

  getData() {
    this.enterprise_alarm_service
      .getEnterprises()
      .subscribe((resp: ActionRes<Array<EnterpriseModel>>) => {
        if (resp.item) {
          // console.log("Enterprise fetch via getEnterprises: ", resp.item);
          this.enterprise_list_grid_dataset = resp.item;
        }
      });
  }
  enterpriseListGridReady(angularGrid: AngularGridInstance) {
    this.enterprise_list_angular_grid = angularGrid;
    this.enterprise_list_grid_data_view = angularGrid.dataView;
    this.enterprise_list_grid = angularGrid.slickGrid;
    this.enterprise_list_grid_service = angularGrid.gridService;
  }
  async onEnterpriseListGridCellChanged(e, args) {
    this.enterprise_list_grid_updated_object = args.item;
    // this.enterprise_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupEnterpriseListGrid() {
    this.enterprise_list_grid_column_definitions = [
      {
        name: "",
        field: "",
        id: "",
        formatter: this.enterpriseEditButtonFormat,
        width: 40,
        onCellClick: this.editEnterprise,
      },
      {
        name: "",
        field: "",
        id: "",
        formatter: this.enterpriseDeleteButtonFormat,
        width: 40,
        onCellClick: this.editEnterprise,
      },
      {
        name: "#",
        field: "",
        id: "",
        formatter: function (row) {
          return (row + 1).toString();
        },
        width: 40,
      },
      {
        id: "display_text",
        name: "Enterprise",
        field: "display_text",
        type: FieldType.string,
        sortable: true,
        minWidth: 140,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "address_line_1",
        name: "Regd. Address",
        field: "address_line_1",
        type: FieldType.string,
        sortable: true,
        minWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "locality",
        name: "Locality",
        field: "locality",
        type: FieldType.string,
        sortable: true,
        minWidth: 130,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "zipcode",
        name: "ZIP/PIN",
        field: "zipcode",
        type: FieldType.string,
        sortable: true,
        minWidth: 60,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "email",
        name: "Email",
        field: "email",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "phone_1",
        name: "Phone",
        field: "phone_1",
        type: FieldType.string,
        sortable: true,
        minWidth: 60,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      /*   {
          id: "is_active",
          name: "Active",
          field: "is_active",
          type: FieldType.string,
          sortable: true,
          minWidth: 40,
          maxWidth: 80,
          filterable: true,
          filter: { model: Filters.compoundInput }
        }, */
      {
        id: "exist_since",
        name: "Exist Since",
        field: "exist_since",
        sortable: false,
        minWidth: 40,
        type: FieldType.dateIso,
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
        id: "last_modified",
        name: "Last Modified",
        field: "last_modified",
        sortable: false,
        minWidth: 40,
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
      },
    ];
    this.enterprise_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "enterprise-list-grid-container",
        // sidePadding: 10
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableFiltering: true,
      enableAutoTooltip: true,
    };
  }
  goToEnterpriseMerge() {
    this.router.navigate(["enterprisemerge"], { relativeTo: this.route });
  }
  editEnterprise = (e, args: OnEventArgs) => {
    let navigation_extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        id: args.dataContext.id,
      },
    };
    this.router.navigate(["enterprisemerge"], navigation_extras);
  };

  deleteEnterprise = (e, args: OnEventArgs) => {
    /* console.log("Data to be deleted: ", args.dataContext.id);
    this.enterprise_alarm_service.deleteEnterpriseById(args.dataContext.id).subscribe(
      resp => {
        this.toastr_service.success("Saved");
      },
      error => {
        this.toastr_service.error("Error on saving");
      }
    ); */
  };

  enterpriseEditButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
  };
  enterpriseDeleteButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    return `<i class="fa fa-trash" style="color:red;cursor:pointer;text-align: center" aria-hidden="true"></i>`;
  };
}
