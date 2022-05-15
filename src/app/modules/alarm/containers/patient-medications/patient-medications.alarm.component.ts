import { Component, OnInit } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  OnEventArgs,
  Formatter,
  Formatters
} from "angular-slickgrid";
import * as _ from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import { Devices, DevicesWrapper } from "../../models/devices.model";
import { PatientMediactionsAlarmService } from "./patient-medications.alarm.service";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import { PopupQRCodeComponent } from "../popup-qrcode/popup-qrcode.component";
import { MatDialog } from "@angular/material/dialog";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import {
  PatientMedicationsWrapper,
  PatientMedications,
  PatientMedicationsCriteria
} from "../../models/patientmedications.model";
import * as moment from "moment";
import { v4 as uuid } from "uuid";

import { PointofcareEscalationModel } from "../../models/pointofcare.model";
@Component({
  selector: "alarm-patient-medications",
  templateUrl: "./patient-medications.alarm.component.html",
  styleUrls: ["./patient-medications.alarm.component.css"]
})
export class PatientMedicationsAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private patientmedication_alarm_service: PatientMediactionsAlarmService,
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
  search_string: string = "";
  // permission: any = {};
  /* slick grid */
  patientmedication_list_angular_grid: AngularGridInstance;
  patientmedication_list_grid: any;
  patientmedication_list_grid_service: GridService;
  patientmedication_list_grid_data_view: any;
  patientmedication_list_grid_column_definitions: Column[];
  patientmedication_list_grid_options: GridOption;
  patientmedication_list_grid_dataset: Array<PatientMedicationsWrapper>;
  patientmedication_list_grid_updated_object: any;
  selected_device_rows = [];

  _temp_hl7_message: string = `MSH|^~\&|CH|CHIMIO|ISP|TBD|20220321131003||RAS^O17^RAS_O17|202008060946430011|P|2.5|AL|8859/1|2.0
PID|1||@patient_identifier||@last_name^@first_name||@dob|@gender
PV1|1|I|@poc^@room^@bed|R|||CENG^COMPUTER ENGINEERING^^^^^^^PUMPSOFT^^L^D^^^EI||||||||||||@visit_number|||||||||||||||||||||||||@admission_date|||||||A
ORC|RE|@order_code|F_ORD_1^CHIMIO||IP||^^^@current_date||@current_date|||E110017^SUMMERS^ALI|||||||CENG^COMPUTER ENGINEERING^^^^^^^PUMPSOFT^^L^D^^^EI
TQ1|1|@vbi^@vbi_displaytext&@vbi_code|||||||||||@time_expected^@time_unit_display_text
RXR|IV^Intravenous Route
RXA|IDT3716223|67752|@current_date|@current_end|P2121^@drug_displaytext|1|1^mg||1^ml^1^mL/hr^1^ml/hr`;

  getData() {}
  gotoImportDevices() {
    this.router.navigate(["import-devices"], { relativeTo: this.route });
  }
  editDevice = device => {
    // var device = this.patientmedication_list_grid_dataset[this.selected_patientmedication_rows[0]];
    this.router.navigate(["device-merge"], {
      relativeTo: this.route,
      queryParams: {
        id: device.id
      }
    });
  };
  deleteDevice = device => {};
  toggleSuspendDevice = device => {};
  /* slick grid */
  patientmedicationListGridReady(angularGrid: AngularGridInstance) {
    this.patientmedication_list_angular_grid = angularGrid;
    this.patientmedication_list_grid_data_view = angularGrid.dataView;
    this.patientmedication_list_grid = angularGrid.slickGrid;
    this.patientmedication_list_grid_service = angularGrid.gridService;
    this.translate.onLangChange.subscribe(lang => {
      var cols = angularGrid.extensionService.getAllColumns();
      for (var i = 0, il = cols.length; i < il; i++) {
        if (
          cols[i].id &&
          typeof cols[i].id == "string" &&
          (cols[i].id as string).length > 0
        )
          cols[i].name = this.translate.instant(cols[i].id as string);
      }
      this.patientmedication_list_angular_grid.extensionService.renderColumnHeaders(
        cols
      );
    });
  }
  async onDeviceListGridCellChanged(e, args) {
    this.patientmedication_list_grid_updated_object = args.item;
    // this.patientmedication_list_angular_grid.resizerService.resizeGrid(10);
  }

  setupDeviceListGrid() {
    this.patientmedication_list_grid_column_definitions = [
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
          if (dataContext.patient_order_id == 0) {
            return `<i class="fa fa-check-square-o" style="color:green;cursor:pointer;" aria-hidden="true"></i>`;
          } else {
            return `<i class="fa fa-lock" style="color:red;cursor:pointer;" aria-hidden="true"></i>`;
          }
        },

        maxWidth: 30,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          var medication: PatientMedicationsWrapper = args.dataContext;
          if (medication.patient_order_id == 0) {
            this.popupCommon("ORDER", medication);
          }
        }
      },
      {
        name: "#",
        field: "",
        id: 3,
        formatter: function(row) {
          return (row + 1).toString();
        },
        maxWidth: 50
      },
      {
        id: "Serial no",
        name: this.translate.instant("Serial no"),
        field: "drug_code",
        sortable: false,
        minWidth: 80,
        filterable: true,
        type: FieldType.string
      },
      {
        id: "Name",
        name: this.translate.instant("Name"),
        field: "drug_displaytext",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput }
      },
      {
        id: "Prescription No",
        name: this.translate.instant("Prescription No"),
        field: "prescription_number",
        type: FieldType.string,
        sortable: true,
        minWidth: 80,
        filterable: true,
        filter: { model: Filters.compoundInput },
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          let data: PatientMedicationsWrapper = args.dataContext;
          this.popupQRCode(data.prescription_number);
        }
      },
      {
        id: "Patient Identifier",
        name: this.translate.instant("Patient Identifier"),
        field: "patient.identifier",
        type: FieldType.string,
        sortable: true,
        minWidth: 80,
        filterable: true,
        filter: { model: Filters.compoundInput },
        formatter: Formatters.complexObject,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          let data: PatientMedicationsWrapper = args.dataContext;
          this.popupQRCode(data.patient.identifier);
        }
      },
      {
        id: "Dose",
        name: this.translate.instant("Dose"),
        field: "dose",
        type: FieldType.string,
        sortable: true,
        maxWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput }
      },
      {
        id: "Rate",
        name: this.translate.instant("Rate"),
        field: "rate",
        type: FieldType.string,
        sortable: true,
        maxWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput }
      },
      {
        id: "Strength",
        name: this.translate.instant("Strength"),
        field: "strength",
        type: FieldType.string,
        sortable: true,
        maxWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput }
      },
      {
        id: "VBI",
        name: this.translate.instant("VBI"),
        field: "volume_tbi",
        type: FieldType.string,
        sortable: true,
        maxWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput }
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
        }
      }
    ];
    this.patientmedication_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "device-list-grid-container"
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
        hideInColumnTitleRow: true
      },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      }
    };
  }

  // deviceListHandleSelectedRowsChanged(e, args) {
  //   console.log("selected rows", args);
  //   this.selected_patientmedication_rows = args.rows;
  // }
  // unSelectDeviceRows() {
  //   this.patientmedication_list_grid.setSelectedRows([]);
  // }
  popupQRCode(data: string) {
    this.alert_dialog.open(PopupQRCodeComponent, {
      data: {
        // edit
        message: data.toString()
      }
    });
  }
  popupCommon(e, medication: PatientMedicationsWrapper) {
    if (e == "ORDER") {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          // edit
          message: this.translate.instant(`Do you wish to proceed?`)
        }
      });
      alert.afterClosed().subscribe(can_Delete => {
        if (can_Delete) {
          this.replaceHL7Messages(medication);
        }
      });
    }
  }

  replaceHL7Messages = async (medication: PatientMedicationsWrapper) => {
    var request = this._temp_hl7_message;

    var addmission = moment(medication.patientvisit.admission_dttm).format(
      "YYYYMMDDHHmmss"
    );
    var dob = moment(medication.patient.dob).format("YYYYMMDDHHmmss");
    var current_date = moment().format("YYYYMMDDHHmmss");

    request = request.replace(
      "@patient_identifier",
      medication.patient.identifier
    );
    request = request.replace("@first_name", medication.patient.first_name);
    request = request.replace("@last_name", medication.patient.last_name);
    request = request.replace("@dob", dob);
    request = request.replace("@gender", medication.patient.gender);
    request = request.replace("@poc", medication.patientvisit.point_of_care);
    request = request.replace("@room", medication.patientvisit.room);
    request = request.replace("@bed", medication.patientvisit.bed);
    request = request.replace(
      "@visit_number",
      medication.patientvisit.visit_number
    );
    request = request.replace("@admission_date", addmission);
    request = request.replace("@order_code", medication.prescription_number);
    request = request.replace(/@current_date/g, current_date);
    request = request.replace("@vbi", medication.volume_tbi.toString());
    request = request.replace(
      "@vbi_displaytext",
      medication.volume_unit_displaytext
    );
    request = request.replace(
      "@vbi_code",
      medication.volume_unit_code.length == 0
        ? medication.volume_unit_displaytext
        : medication.volume_unit_code
    );
    request = request.replace(
      "@time_expected",
      medication.time_expected.toString()
    );
    request = request.replace(
      "@time_unit_display_text",
      medication.time_unit_displaytext
    );
    var cureent_date_end = moment().format("YYYYMMDDHHmmss");
    switch (medication.time_unit_displaytext) {
      case "S":
        cureent_date_end = moment()
          .add(medication.time_expected, "seconds")
          .format("YYYYMMDDHHmmss");

        break;
      case "M":
        cureent_date_end = moment()
          .add(medication.time_expected, "minutes")
          .format("YYYYMMDDHHmmss");

        break;
      case "H":
        cureent_date_end = moment()
          .add(medication.time_expected, "hours")
          .format("YYYYMMDDHHmmss");

        break;
      default:
        break;
    }

    request = request.replace("@current_end", cureent_date_end);
    request = request.replace("@drug_displaytext", medication.drug_displaytext);
    console.log("HL7 message ", request);

    this.patientmedication_alarm_service.createOrder(request).subscribe(
      (resp: ActionRes<Array<PatientMedicationsWrapper>>) => {
        if (resp.item) {
          // this.patientmedication_list_grid_dataset = resp.item;
          this.toastr_service.success("Order placed successfully");
          this.onSearchValue();
        }
      },
      err => {
        this.toastr_service.error("Error Occured");
      }
    );
  };

  onSearchValue = () => {
    console.log("event check ", this.search_string);
    var request = new ActionReq<PatientMedicationsCriteria>();
    request.item = new PatientMedicationsCriteria();
    request.item.patient_identifier = this.search_string
    this.patientmedication_alarm_service
      .getMedicationsForpatient(request)
      .subscribe((resp: ActionRes<Array<PatientMedicationsWrapper>>) => {
        if (resp.item.length > 0) {
          this.patientmedication_list_grid_dataset = resp.item;
        }
      });
  };
  createAlarm = (device: Devices) => {
    this.router.navigate(["alarmtest"], {
      relativeTo: this.route,
      queryParams: {
        id: device.id
      }
    });
    // var request = this._temp_hl7_alarm;
    // request = request.replace(/@deviceid/g, device.identifier);
    // var resp = 1;
    // this.patientmedication_alarm_service.createAlarm(request).subscribe(
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
