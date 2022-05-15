import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
} from "angular-slickgrid";
import * as XLSX from "xlsx";
import * as _ from "lodash";
import { ImportDevicesAlarmService } from "./import-devices.alarm.service";
import { Devices } from "../../models/devices.model";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { json_custom_parser } from "src/app/modules/global/utils";
import { TranslateService } from "@ngx-translate/core";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { UserMergeUserModel } from "../user-merge/usermergeuser.model";
@Component({
  selector: "alarm-import-devices",
  templateUrl: "./import-devices.alarm.component.html",
  styleUrls: ["./import-devices.alarm.component.css"],
})
export class ImportDevicesAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private import_devices_alarm_service: ImportDevicesAlarmService,
    private toastr_service: ToastrService,
    private location: Location,
    public translate: TranslateService
  ) {}
  ngOnInit() {
    this.setupDeviceListGrid();
  }
  /* slick grid */
  device_list_angular_grid: AngularGridInstance;
  device_list_grid: any;
  device_list_grid_service: GridService;
  device_list_grid_data_view: any;
  device_list_grid_column_definitions: Column[];
  device_list_grid_options: GridOption;
  device_list_grid_dataset: any[];
  device_list_grid_updated_object: any;
  selected_device_rows: Array<UserMergeUserModel> =
    new Array<UserMergeUserModel>();
  /* variables */
  device_list_sheet: string = "";

  importDevices() {
    if (this.selected_device_rows.length > 0) {
      var device_list = _.map(
        this.selected_device_rows,
        (v:any) => {
          return this.device_list_grid_dataset[v];
        }
      );
      var request = new ActionReq<Array<UserMergeUserModel>>();
      request.item = device_list;
      this.import_devices_alarm_service.createDeviceInBulk(request).subscribe(
        (resp: ActionRes<Array<Devices>>) => {
          let is_error_occued = false;
          if (resp.item.length > 0) {
            resp.item.forEach((v) => {
              if (v.error && v.error.length != 0) {
                is_error_occued = true;
              }
            });
            if (is_error_occued) {
              this.device_list_grid_dataset = resp.item;
            } else {
              this.toastr_service.success(
                this.translate.instant("Devices Imported")
              );
              this.location.back();
            }
          }
        },
        (error) => {
          var error_message = this.translate.instant("Error importing devices");
          if (_.has(error, "error.message"))
            error_message = error.error.message;
          this.toastr_service.error(error_message);
        }
      );
    }
  }
  onClickReset() {
    this.device_list_sheet = "";
    this.selected_device_rows = [];
    this.device_list_grid_dataset = [];
  }
  onFileChange(e) {
    console.log(e);
    let workBook = null;
    let json_data = null;
    const reader = new FileReader();
    const file = e.target.files[0];
    this.device_list_sheet = e.target.files[0].name;
    reader.onload = (event) => {
      import("xlsx").then((XLSX) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: "binary" });
        json_data = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        const dataString = JSON.stringify(json_data);
        console.log("json datads", json_data);
        var device_list: Array<UserMergeUserModel> = [];
        _.forEach(json_data, (v, k) => {
          device_list = _.concat(device_list, v);
        });
        var _temp_device_list = [];
        _.forEach(device_list, (v, k) => {
          let _temp_device = new Devices();
          _temp_device.display_text = v["Name"];
          _temp_device.identifier = v["Serial No"];
          _temp_device.manufacturer = v["Manufacturer"];
          _temp_device.model = v["Model"];
          _temp_device.type = v["Type"];
          _temp_device.auto_program_enabled = v["Auto Prog"];
          _temp_device.auto_doc_enabled = v["Auto Doc"];
          _temp_device.id = ++k;
          // if (
          //   _temp_device.display_text == undefined ||
          //   _temp_device.identifier == undefined ||
          //   _temp_device.manufacturer == undefined ||
          //   _temp_device.model == undefined ||
          //   _temp_device.type == undefined ||
          //   _temp_device.auto_program_enabled == undefined ||
          //   _temp_device.auto_doc_enabled == undefined
          // ) {
          //   _temp_device.error = "Fill required fields";
          // }
          v.id = ++k;
          _temp_device_list.push(_temp_device);
        });
        this.device_list_grid_dataset = _temp_device_list;
        // this.device_list_grid_dataset = device_list;
        device_list.forEach((v1, k: any) => {
          this.selected_device_rows.push(k);
        });
        this.device_list_grid.setSelectedRows(this.selected_device_rows);
      });
    };
    reader.readAsBinaryString(file);
  }
  gotoImportDevices() {
    this.router.navigate(["importdevices"], { relativeTo: this.route });
  }
  /* slick grid */
  deviceListGridReady(angularGrid: AngularGridInstance) {
    this.device_list_angular_grid = angularGrid;
    this.device_list_grid_data_view = angularGrid.dataView;
    this.device_list_grid = angularGrid.slickGrid;
    this.device_list_grid_service = angularGrid.gridService;
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
      this.device_list_angular_grid.extensionService.renderColumnHeaders(cols);
    });
  }
  async onDeviceListGridCellChanged(e, args) {
    this.device_list_grid_updated_object = args.item;
    // this.device_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupDeviceListGrid() {
    this.device_list_grid_column_definitions = [
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
        id: "Serial No",
        name: "Serial No",
        field: "identifier",
        sortable: false,
        minWidth: 120,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "Name",
        name: "Name",
        field: "display_text",
        type: FieldType.string,
        sortable: true,
        minWidth: 140,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Manufacturer",
        name: "Manufacturer",
        field: "manufacturer",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Model",
        name: "Model",
        field: "model",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Type",
        name: "Type",
        field: "type",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      // {
      //   id: "created_on",
      //   name: "When created",
      //   field: "created_on",
      //   type: FieldType.string,
      //   sortable: true,
      //   minWidth: 150,
      //   filterable: true,
      //   filter: { model: Filters.compoundInput }
      // },

      {
        id: "Auto Prog",
        name: "Auto Prog",
        field: "auto_program_enabled",
        sortable: false,
        minWidth: 110,
        filterable: true,
        type: FieldType.boolean,
      },
      {
        id: "Auto Doc",
        name: "Auto Doc",
        field: "auto_doc_enabled",
        sortable: false,
        minWidth: 110,
        filterable: true,
        type: FieldType.boolean,
      },

      // {
      //   id: "last_alarm_on",
      //   name: "Last alarm on",
      //   field: "last_alarm_on",
      //   sortable: false,
      //   minWidth: 110,
      //   filterable: true,
      //   type: FieldType.boolean
      // },
      {
        id: "Import Status",
        name: "Import Status",
        field: "error",
        type: FieldType.string,
        sortable: true,
        minWidth: 110,
        maxWidth: 220,
        filterable: true,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          if (value == undefined && dataContext.is_assigned == false) {
            return `<span class="text-warning">Device created. Unable to assign device to Port service</span>`;
          } else if (value == undefined) {
            return `<span class="text-success">Success!</span>`;
          }
          if (dataContext.serial_no == "") {
            return `<span class="text-danger">Invalid serial number</span>`;
          }
          if (value.length > 0 && value != undefined) {
            var temp = json_custom_parser.parse(value, "");
            if (_.get(temp, "message", "") == "success") {
              return `<span class="text-success">Success!</span>`;
            } else if (_.get(temp, "code"))
              return `<span class="text-danger">${_.get(
                temp,
                "message",
                ""
              )}</span>`;
            else if (_.get(temp, "number") === 547)
              return `<span class="text-danger">Invalid device type</span>`;
            else return `<span class='text-danger'>${value}</span>`;
          }
        },
      },
    ];
    this.device_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "device-list-grid-container",
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
      enableCheckboxSelector: true,
      enableRowSelection: true,
    };
  }

  deviceListHandleSelectedRowsChanged(e, args) {
    this.selected_device_rows = args.rows;
    console.log("device selected rows ", this.selected_device_rows);
  }
  unSelectDeviceRows() {
    this.device_list_grid.setSelectedRows([]);
  }

  backDevice() {
    //this.router.navigate(["alarm/pending"]);
    // let navigation_extras: NavigationExtras = {
    //   queryParams: {
    //     device: true,
    //   },
    // };
    // this.router.navigate(["./"], navigation_extras);
    this.location.back();
  }
}
