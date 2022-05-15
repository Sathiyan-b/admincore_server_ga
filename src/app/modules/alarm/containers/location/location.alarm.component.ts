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
import { LocationAlarmService } from "./location.alarm.service";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { ToastrService } from "ngx-toastr";
import * as _ from "lodash";
import {LocationModel} from "../../models/location.model";
import { EnterpriseAssociation } from "../../models/enterprise.model";
import * as moment from "moment";

@Component({
  selector: "alarm-location",
  templateUrl: "./location.alarm.component.html",
  styleUrls: ["./location.alarm.component.css"],
})
export class LocationAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location_alarm_service: LocationAlarmService
  ) {}

  ngOnInit() {
    this.setupLocationListGrid();
    this.getData();
  }

  // slick grid
  location_list_angular_grid: AngularGridInstance;
  location_list_grid: any;
  location_list_grid_service: GridService;
  location_list_grid_data_view: any;
  location_list_grid_column_definitions: Column[];
  location_list_grid_options: GridOption;
  location_list_grid_dataset: any[];
  location_list_grid_updated_object: any;

  getData() {
    this.location_alarm_service
      .getLocations()
      .subscribe((resp: ActionRes<Array<LocationModel>>) => {
        if (resp.item) {
          // console.log("Location fetch via getLocations: ", resp.item);
          this.location_list_grid_dataset = resp.item;
        }
      });
  }
  locationListGridReady(angularGrid: AngularGridInstance) {
    this.location_list_angular_grid = angularGrid;
    this.location_list_grid_data_view = angularGrid.dataView;
    this.location_list_grid = angularGrid.slickGrid;
    this.location_list_grid_service = angularGrid.gridService;
  }
  async onLocationListGridCellChanged(e, args) {
    this.location_list_grid_updated_object = args.item;
    // this.location_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupLocationListGrid() {
    this.location_list_grid_column_definitions = [
      {
        name: "",
        field: "",
        id: "",
        formatter: this.locationEditButtonFormat,
        width: 40,
        onCellClick: this.editLocation,
      },
      {
        name: "",
        field: "",
        id: "",
        formatter: this.locationDeleteButtonFormat,
        width: 35,
        onCellClick: this.editLocation,
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
        name: "Location",
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
        minWidth: 200,
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
      {
        id: "enterprise",
        name: "Enterprise",
        field: "enterprise",
        formatter: (row: any, cell: any, value: any) => {
          var enterprise_name = `${value.display_text}`;
          return enterprise_name == "undefined" ? "" : enterprise_name;
        },
        sortable: false,
        minWidth: 120,
        filterable: true,
        type: FieldType.string,
      },
      /* {
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
    this.location_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "location-list-grid-container",
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
  goToLocationMerge() {
    this.router.navigate(["locationmerge"], { relativeTo: this.route });
  }
  editLocation = (e, args: OnEventArgs) => {
    let navigation_extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        id: args.dataContext.id,
      },
    };
    this.router.navigate(["locationmerge"], navigation_extras);
  };

  deleteLocation = (e, args: OnEventArgs) => {
    /* console.log("Data to be deleted: ", args.dataContext.id);
    this.location_alarm_service.deleteLocationById(args.dataContext.id).subscribe(
      resp => {
        this.toastr_service.success("Saved");
      },
      error => {
        this.toastr_service.error("Error on saving");
      }
    ); */
  };

  locationEditButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
    return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
  };
  locationDeleteButtonFormat: Formatter = (
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
