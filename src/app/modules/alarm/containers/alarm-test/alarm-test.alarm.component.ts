import { Component, OnInit } from "@angular/core";
import { Devices } from "../../models/devices.model";
import { ActivatedRoute, Router } from "@angular/router";
import { AlarmTestAlarmService } from "./alarm-test.alarm.service";

import * as _ from "lodash";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { ReferenceListModel } from "../../models/referencelist.model";
import { TranslateService } from "@ngx-translate/core";
import { ValidatorService } from "src/app/modules/global/service/validator/validator.service";
import { PatientVisitsWrapper } from "../../models/patientvisits.model";
import * as moment from "moment";
import { Patients } from "../../models/patients.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { IVGatewayAssociationWrapper } from "../../models/ivgateway.model";
import { PatientOrders } from "../../models/patientorders.model";
@Component({
  selector: "alarm-device-merge",
  templateUrl: "./alarm-test.alarm.component.html",
  styleUrls: ["./alarm-test.alarm.component.css"]
})
export class AlarmTestAlarmComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private device_merge_alarm_service: AlarmTestAlarmService,
    private toastr_service: ToastrService,
    private location: Location,
    public translate: TranslateService,
    public validator_service: ValidatorService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.device.id = _.get(params, "id", 0);
      if (this.device.id != 0) {
        this.getDeviceData();
        this.getPatientAndVisitV2();
      }
    });
  }
  device = new Devices();
  patient = new PatientVisitsWrapper();
  patient_order_list: Array<PatientVisitsWrapper> = [];
  filter_patient_order_list: Array<PatientVisitsWrapper> = [];
  patient_identifier: string = "";
  patient_info = new Patients();
  addmission_date: string = "";
  patient_dob: string = "";
  is_alarm_trigger: boolean = true;

  _temp_hl7_alarm: string = `MSH|^~\&|PAT_DEVICE_ICU_MEDICAL^0003B10000000001^EUI-64|ICU_MEDICAL|||20220209124005||ORU^R40^ORU_R40|69796|P|2.6|||AL|NE|USA|UNICODE UTF-8|en^English^ISO639||ACM_04^IHE PCD^1.3.6.1.4.1.19376.1.6.1.4.1^ISO
PID|||@patient_identifier^^^PAT_DEVICE_ICU_MEDICAL^PI||@last_name^@first_name^^^^^L||@dob|@gender
PV1||I|@poc^@room^@bed^^^N^^||||||||||||||||@visit_number|||||||||||||||||||||||||@admission_date||||||||  OBR|1|@order_code^PAT_DEVICE_ICU_MEDICAL^0003B10000000001^EUI-64|50046^PAT_DEVICE_ICU_MEDICAL^0003B10000000001^EUI-64|196616^MDC_EVT_ALARM^MDC|||20220209124005
OBX|1||70049^MDC_DEV_PUMP_INFUS_LVP_MDS^MDC|21766848.0.0.0|||||||X|||20220209124005||||@deviceid|20220209124005
OBX|2||70050^MDC_DEV_PUMP_INFUS_LVP_VMD^MDC|21766848.1.0.0|||||||X|||20220209124005||||@deviceid|20220209124005
OBX|3|ST|531975^MDC_ID_PROD_SPEC_SW^MDC|43455986.1.0.1|InfuserType=PLUM_360~Infuser Software=15.11.00.018~Connectivity Engine=03.04.00.024~Binary Updater=15.11.00.018~Boot Loader=15.11.00.018~Drug Library=D92A122CD645495D8FE880E421E77ADB 10-11-2021 B 10106||||||X|||20220209124005||||@deviceid|20220209124005
OBX|4|ST|0^MDCX_PUMP_POWER_STATUS^MDC|21766848.1.0.3|PowerSource=AC~BatteryStatus=LEVEL_4||||||R|||20220209124005||||@deviceid|20220209124005
OBX|5|ST|0^MDCX_PUMP_MAINTENANCE_STATUS^MDC|21766848.1.0.5|TimeInService=0||||||R|||20220209124005||||@deviceid|20220209124005
OBX|6|ST|196616^MDC_EVT_ALARM^MDC|21766848.1.0.0.1|56^@alarm_identifier^MDC^^^^^^@alarm_text||||||R|||20220209124005||||@deviceid|20220209124005
OBX|7|ST|68480^MDC_ATTR_ALERT_SOURCE^MDC|21766848.1.0.0.2|||||||R
OBX|8|ST|68481^MDC_ATTR_EVENT_PHASE^MDC|21766848.1.0.0.3|start||||||R
OBX|9|ST|68482^MDC_ATTR_ALARM_STATE^MDC|21766848.1.0.0.4|active||||||R
OBX|10|ST|68483^MDC_ATTR_ALARM_INACTIVATION_STATE^MDC|21766848.1.0.0.5|||||||R
OBX|11|ST|68484^MDC_ATTR_ALARM_PRIORITY^MDC|21766848.1.0.0.6|20||||||R
OBX|12|ST|68485^MDC_ATTR_ALERT_TYPE^MDC|21766848.1.0.0.7|ST||||||R`;

  alarm_type_list: Array<{ identifier: string; display_text: string }> = [
    { identifier: "MDC_EVT_BATT_DEPL", display_text: "Depleted Battery" },
    { identifier: "MDC_EVT_BATT_LO", display_text: "Low Battery" },
    { identifier: "MDC_EVT_BATT_SERV", display_text: "Service Battery" },
    { identifier: "MDC_EVT_CHECK_IV_SET", display_text: "Check Cassette" },
    {
      identifier: "MDC_EVT_DOOR_POSN_ERR",
      display_text: "Cassette Eject Lever"
    },
    { identifier: "MDC_EVT_EMER_STOP", display_text: "Emergency Stop" },
    { identifier: "MDC_EVT_FLOW_LO", display_text: "Flow Restriction" },
    { identifier: "MDC_EVT_FLOW_STOP_OPEN", display_text: "Check Flowstop" },
    { identifier: "MDC_EVT_FLUID_LINE_AIR", display_text: "Air in line" },
    { identifier: "MDC_EVT_FLUID_LINE_OCCL", display_text: "Distal Occlusion" },
    {
      identifier: "MDC_EVT_FLUID_LINE_OCCL_PROXIMAL",
      display_text: "Proximal Occlusion"
    },
    { identifier: "MDC_EVT_MALF", display_text: "Malfunction" },
    { identifier: "MDC_EVT_POSN_PROB", display_text: "Barcode Error" }
  ];
  selected_alarmtype: string = "";
  ordercode: string = "";

  getDeviceData() {
    var request = new ActionReq<Devices>();
    request.item = this.device;
    this.device_merge_alarm_service
      .getdevice(request)
      .subscribe((resp: ActionRes<Array<Devices>>) => {
        if (resp.item.length > 0) {
          this.device = resp.item[0];
          this._temp_hl7_alarm = this._temp_hl7_alarm.replace(
            /@deviceid/g,
            this.device.identifier
          );
        }
      });
  }
  getPatientAndVisitV2() {
    this.device_merge_alarm_service
      .getAssociatedOrdersForDevices(this.device.id)
      .subscribe((resp: ActionRes<Array<PatientVisitsWrapper>>) => {
        if (resp.item.length > 0) {
          this.filter_patient_order_list = resp.item;
          this.filterPatientOrder();
          // this.replacePatientValues(this.patient);
        }
      });
  }
  getPatientAndVisit(e) {
    console.log("checking");
    this.device_merge_alarm_service
      .getPatientAndVisitForOrderCode(this.ordercode)
      .subscribe((resp: ActionRes<Array<PatientVisitsWrapper>>) => {
        if (resp.item.length > 0) {
          this.patient = resp.item[0];
          // this.replacePatientValues(this.patient);
        }
      });
  }
  filterPatientOrder = () => {
    this.patient = new PatientVisitsWrapper();
    this.patient_info = new Patients();
    if (this.is_alarm_trigger) {
      this.patient_order_list = this.filter_patient_order_list.filter(v1 => {
        return v1.order_status == PatientOrders.ORDER_STATUS.SOME_RESULTS;
      });
    } else {
      this.patient_order_list = this.filter_patient_order_list.filter(v1 => {
        return (
          v1.order_status == PatientOrders.ORDER_STATUS.INPROGRESS_SCHEDULED
        );
      });
    }
  };
  onChangeAlarmType = () => {
    var item = this.alarm_type_list.find(v1 => {
      return v1.display_text == this.selected_alarmtype;
    });
    if (item != undefined) {
      this._temp_hl7_alarm = this._temp_hl7_alarm.replace(
        "@alarm_identifier",
        item.identifier
      );
      this._temp_hl7_alarm = this._temp_hl7_alarm.replace(
        "@alarm_text",
        item.display_text
      );
    }
  };
  replacePatientValues = patientvisit => {
    console.log("patinet visit ", patientvisit);
    if (patientvisit != undefined) {
      this.patient = patientvisit;
      var request = this._temp_hl7_alarm;
      var patient_info = patientvisit.patient_info.split("|");
      if (patient_info.length > 0) var name = patient_info[0].split(" ");
      if (name.length > 0) var first_name = _.defaultTo(name[0], "");
      this.patient_info.first_name = first_name;
      if (name.length > 1) var last_name = _.defaultTo(name[1], "");
      this.patient_info.last_name = last_name;
      if (patient_info.length > 1) {
        var dob = moment(patient_info[1], "lll").format("YYYYMMDDHHMMSS");
        this.patient_dob = moment(patient_info[1], "lll").format(
          "DD-MM-YYYY HH:MM:SS"
        );
      }
      if (patient_info.length > 2) var gender = patient_info[2];
      this.patient_info.gender = gender;
      var addmission = moment(patientvisit.admission_dttm).format(
        "YYYYMMDDHHMMSS"
      );
      this.addmission_date = moment(patientvisit.admission_dttm).format(
        "DD-MM-YYYY HH:MM:SS"
      );

      request = request.replace(
        "@patient_identifier",
        _.defaultTo(patient_info[3], "")
      );
      request = request.replace("@first_name", first_name);
      request = request.replace("@last_name", last_name);
      request = request.replace("@dob", dob);
      request = request.replace("@gender", gender);
      request = request.replace("@poc", patientvisit.point_of_care);
      request = request.replace("@room", patientvisit.room);
      request = request.replace("@bed", patientvisit.bed);
      request = request.replace("@visit_number", patientvisit.visit_number);
      request = request.replace("@admission_date", addmission);
      this._temp_hl7_alarm = request;
    }
  };
  addDeviceManufacturer(name) {
    return { display_text: name };
  }
  addDeviceType(name) {
    return { display_text: name };
  }
  addDeviceModel(name) {
    return { display_text: name };
  }

  save() {
    if (this.is_alarm_trigger) {
      this._temp_hl7_alarm = this._temp_hl7_alarm.replace(
        "@order_code",
        this.ordercode
      );
      var _req = new IVGatewayAssociationWrapper();
      _req.patient_id = this.patient.patient_id;
      _req.patient_visit_id = this.patient.id;
      _req.device_id = this.device.id;
      _req.patient_order_id = this.patient.patient_order_id;
      _req.hl7_message = this._temp_hl7_alarm;
      this.device_merge_alarm_service
        .createAlarm(_req)
        .subscribe((resp: ActionRes<any>) => {
          this.toastr_service.success("Alarm sent successfully");
        });
    } else {
      var _order_req = new PatientOrders();
      _order_req.order_code = this.patient.order_code;
      _order_req.order_status = PatientOrders.ORDER_STATUS.SOME_RESULTS;
      this.device_merge_alarm_service
        .startOrder(_order_req)
        .subscribe((resp: ActionRes<any>) => {
          this.toastr_service.success("Alarm sent successfully");
        });
    }
  }
  cancel() {
    this.location.back();
  }
}
