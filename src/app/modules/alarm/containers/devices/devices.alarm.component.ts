import { Component, OnInit } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  OnEventArgs,
} from "angular-slickgrid";
import * as _ from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import { Devices, DevicesWrapper } from "../../models/devices.model";
import { DevicesAlarmService } from "./devices.alarm.service";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import { MatDialog } from "@angular/material/dialog";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { PopupQRCodeComponent } from '../popup-qrcode/popup-qrcode.component';
@Component({
  selector: "alarm-devices",
  templateUrl: "./devices.alarm.component.html",
  styleUrls: ["./devices.alarm.component.css"],
})
export class DevicesAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private device_alarm_service: DevicesAlarmService,
    private alert_dialog: MatDialog,
    private global_service: GlobalService,
    private toastr_service: ToastrService,
    public translate: TranslateService
  ) {}
  ngOnInit() {
    this.getData();
    this.setupDeviceListGrid();
  }
  /* variable */
  delete = "INACTIVE";
  lock = "LOCKED";
  edit = "ACTIVE";
  // permission: any = {};
  /* slick grid */
  device_list_angular_grid: AngularGridInstance;
  device_list_grid: any;
  device_list_grid_service: GridService;
  device_list_grid_data_view: any;
  device_list_grid_column_definitions: Column[];
  device_list_grid_options: GridOption;
  device_list_grid_dataset: Array<Devices>;
  device_list_grid_updated_object: any;
  selected_device_rows = [];

  getData() {
    /* permission */
    // this.permission = this.global_service.permission_object;

    var request = new ActionReq<Devices>();
    request.item = new Devices();
    this.device_alarm_service
      .getdeviceList(request)
      .subscribe((resp: ActionRes<Array<Devices>>) => {
        if (resp.item.length > 0) {
          this.device_list_grid_dataset = resp.item;
        }
      });
  }
  gotoImportDevices() {
    this.router.navigate(["import-devices"], { relativeTo: this.route });
  }
  editDevice = (device) => {
    // var device = this.device_list_grid_dataset[this.selected_device_rows[0]];
    this.router.navigate(["device-merge"], {
      relativeTo: this.route,
      queryParams: {
        id: device.id,
      },
    });
  };
  deleteDevice = (device) => {
    // var selected_devices = _.map(this.selected_device_rows, (v) => {
    //   return this.device_list_grid_dataset[v];
    // });
    var request = new ActionReq<Devices>();
    request.item = device;
    this.device_alarm_service.deleteDevice(request).subscribe(
      (resp: ActionRes<Devices>) => {
        if (resp.item) {
          this.toastr_service.success(
            this.translate.instant("Device(s) Deletion sucessfull")
          );
          this.getData();
          this.device_list_angular_grid.gridService.resetGrid();
        }
      },
      (err) => {
        this.toastr_service.error(
          this.translate.instant("Error in Device Deletion")
        );
      }
    );
  };
  toggleSuspendDevice = (device) => {
    // var selected_devices = _.map(this.selected_device_rows, (v) => {
    //   return this.device_list_grid_dataset[v];
    // })
    var request = new ActionReq<Devices>();
    request.item = device;
    this.device_alarm_service.toggleSuspendDevice(request).subscribe(
      (resp: ActionRes<Devices>) => {
        if (resp.item) {
          this.toastr_service.success(
            this.translate.instant("Device(s) Lock/Unlock sucessfull")
          );
          this.getData();
          this.device_list_angular_grid.gridService.resetGrid();
        }
      },
      (err) => {
        this.toastr_service.error(
          this.translate.instant("Error in Lock/Unlock of Device(s)")
        );
      }
    );
  };
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
  popupQRCode(data: string) {
    console.log("popup qr data ",data)
    this.alert_dialog.open(PopupQRCodeComponent, {
      data: {
        // edit
        message: data.toString()
      }
    });
  }
  setupDeviceListGrid() {
    this.device_list_grid_column_definitions = [
      {
        name: "",
        field: "",
        id: 1,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
        },
        maxWidth: 30,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          var device: Devices = args.dataContext;
          if (device.id != null) this.editDevice(device);
          // this.popupCommon(this.edit,device);
        },
      },
      //  {
      //   name: "",
      //   field: "",
      //   id: "",
      //   formatter: (
      //     row: number,
      //     cell: number,
      //     value: any,
      //     columnDef: Column,
      //     dataContext: any,
      //     grid?: any
      //   ) => {
      //     return `<span style="color:red"> <i class="fas fa-trash-alt"></i>
      //     <span>`
      //   },
      //   minWidth: 10,
      //   maxWidth: 40,
      //   onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
      //     var device: Devices = args.dataContext;
      //     if (device.id != null)
      //       this.popupCommon(this.delete,device);
      //   },
      // },
      {
        name: "",
        field: "",
        id: 2,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          if (dataContext.is_suspended) {
            return `<i class="fa fa-unlock-alt" style="color:green;cursor:pointer;" aria-hidden="true"></i>`;
          } else {
            return `<i class="fa fa-lock" style="color:orange;cursor:pointer;" aria-hidden="true"></i>`;
          }
        },

        maxWidth: 30,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          var device: Devices = args.dataContext;
          if (device.id != null) this.popupCommon(this.lock, device);
        },
      },
      {
        name: "",
        field: "",
        id: 2,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          return `<i class="fa fa-bell" style="color:red;cursor:pointer;" aria-hidden="true"></i>`;
        },

        maxWidth: 30,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          var device: Devices = args.dataContext;
          if (device.id != null) this.popupCommon("ALARM", device);
        },
      },
      {
        name: "#",
        field: "",
        id: 3,
        formatter: function (row) {
          return (row + 1).toString();
        },
        minWidth: 30,
      },
      {
        id: "Serial no",
        name: this.translate.instant("Serial no"),
        field: "identifier",
        sortable: false,
        minWidth: 120,
        filterable: true,
        type: FieldType.string,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          let data: Devices = args.dataContext;
          this.popupQRCode(data.identifier);
        }
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
      },
      {
        id: "Manufacturer",
        name: this.translate.instant("Manufacturer"),
        field: "manufacturer",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Model",
        name: this.translate.instant("Model"),
        field: "model",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Type",
        name: this.translate.instant("Type"),
        field: "type",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "When created",
        name: this.translate.instant("When created"),
        field: "created_on",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
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
        id: "Auto prog",
        name: this.translate.instant("Auto prog"),
        field: "auto_program_enabled",
        sortable: false,
        minWidth: 110,
        filterable: true,
        type: FieldType.boolean,
      },
      {
        id: "Auto doc",
        name: this.translate.instant("Auto doc"),
        field: "auto_doc_enabled",
        sortable: false,
        minWidth: 110,
        filterable: true,
        type: FieldType.boolean,
      },

      {
        id: "last_alarm_on",
        name: "Last alarm on",
        field: "last_alarm_on",
        sortable: false,
        minWidth: 110,
        filterable: true,
        type: FieldType.boolean,
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var last_alarm_string = "";
          if (_.get(dataContext, "last_alarm_on", null) != null) {
            last_alarm_string = this.global_service.formatDateTime(
              dataContext.last_alarm_on
            );
          }
          return last_alarm_string;
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
    };
  }

  // deviceListHandleSelectedRowsChanged(e, args) {
  //   console.log("selected rows", args);
  //   this.selected_device_rows = args.rows;
  // }
  // unSelectDeviceRows() {
  //   this.device_list_grid.setSelectedRows([]);
  // }
  popupCommon(e, device: Devices) {
    if (e == "ALARM") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // edit
          message: this.translate.instant(`Do you wish to proceed?`),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.createAlarm(device);
          // this.editDevice(device);
        }
      });
    }
    if (e == "ACTIVE") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // edit
          message: this.translate.instant(`Do you wish to proceed?`),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.editDevice(device);
        }
      });
    }
    if (e == "INACTIVE") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // delete
          message: this.translate.instant(`Do you wish to proceed Delete ?`),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.deleteDevice(device);
        }
      });
    }
    if (e == "LOCKED") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // lock/unlock
          message: this.translate.instant(
            `Do you wish to proceed Lock/Unlock ?`
          ),
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {
        if (can_Delete) {
          this.toggleSuspendDevice(device);
        }
      });
    }
  }
  createAlarm = (device: Devices) => {
    this.router.navigate(["alarmtest"], {
      relativeTo: this.route,
      queryParams: {
        id: device.id,
      },
    });
    // var request = this._temp_hl7_alarm;
    // request = request.replace(/@deviceid/g, device.identifier);
    // var resp = 1;
    // this.device_alarm_service.createAlarm(request).subscribe(
    //   (resp: ActionRes<boolean>) => {
    //     if (resp.item) {
    //       this.toastr_service.success(
    //         this.translate.instant("Device(s) Lock/Unlock sucessfull")
    //       );
    //     }
    //   },
    //   err => {
    //     this.toastr_service.error(
    //       this.translate.instant("Error in Lock/Unlock of Device(s)")
    //     );
    //   }
    // );
  };
}
