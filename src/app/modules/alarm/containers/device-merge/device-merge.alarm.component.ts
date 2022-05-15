import { Component, OnInit } from "@angular/core";
import { Devices } from "../../models/devices.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceMergeAlarmService } from "./device-merge.alarm.service";
import * as _ from "lodash";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { ReferenceListModel } from "../../models/referencelist.model";
import { TranslateService } from "@ngx-translate/core";
import { ValidatorService } from "src/app/modules/global/service/validator/validator.service";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
@Component({
  selector: "alarm-device-merge",
  templateUrl: "./device-merge.alarm.component.html",
  styleUrls: ["./device-merge.alarm.component.css"]
})
export class DeviceMergeAlarmComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private device_merge_alarm_service: DeviceMergeAlarmService,
    private toastr_service: ToastrService,
    private location: Location,
    public translate: TranslateService,
    public validator_service: ValidatorService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.device.id = _.get(params, "id", 0);
      if (this.device.id != 0) {
        this.is_edit = true;
        this.getDeviceData();
      }
      this.getManufacturerData();
      this.getModelData();
      this.getTypeData();
    });
   
  }
  is_edit = false;
  device = new Devices();
  device_manufacturer_list: Array<ReferenceListModel>;
  device_model_list: Array<ReferenceListModel>;
  device_type_list: Array<ReferenceListModel>;

  getDeviceData() {
    var request = new ActionReq<Devices>();
    request.item = this.device;
    this.device_merge_alarm_service
      .getdevice(request)
      .subscribe((resp: ActionRes<Array<Devices>>) => {
        if (resp.item.length > 0) {
          this.device = resp.item[0];
        }
      });
  }
  getManufacturerData() {
    var request = new ActionReq<ReferenceListModel>();
    request.item = new ReferenceListModel()
    request.item.identifier = ReferenceListModel.TYPES.DEVICE_MANF;
    this.device_merge_alarm_service
      .getReferenceList(request)
      .subscribe((resp: ActionRes<Array<ReferenceListModel>>) => {
        if (resp.item.length > 0) {
          this.device_manufacturer_list = resp.item;
        }
      });
  }
  getModelData() {
    var request = new ActionReq<ReferenceListModel>();
    request.item = new ReferenceListModel()
    request.item.identifier = ReferenceListModel.TYPES.DEVICE_MODEL;
    this.device_merge_alarm_service
      .getReferenceList(request)
      .subscribe((resp: ActionRes<Array<ReferenceListModel>>) => {
        if (resp.item.length > 0) {
          this.device_model_list = resp.item;
        }
      });
  }
  getTypeData() {
    var request = new ActionReq<ReferenceListModel>();
    request.item = new ReferenceListModel()
    request.item.identifier = ReferenceListModel.TYPES.DEVICE_TYPE;
    this.device_merge_alarm_service
      .getReferenceList(request)
      .subscribe((resp: ActionRes<Array<ReferenceListModel>>) => {
        if (resp.item.length > 0) {
          this.device_type_list = resp.item;
        }
      });
  }

  addDeviceManufacturer(name) {
    return { display_text: name, }
  }
  addDeviceType(name) {
    return { display_text: name, }
  }  
  addDeviceModel(name) {
    return { display_text: name, }
  }

  save(form: NgForm) {
    if (form.valid) {
      var request: any = null;
      if (this.is_edit) {
        request = new ActionReq<Devices>();
        request.item = this.device;
        this.device_merge_alarm_service.updateDevice(request).subscribe(
          (resp: ActionRes<Devices>) => {
            if (resp.item) {
              this.toastr_service.success(this.translate.instant("Device Updated"));
              this.location.back();
            }
          },
          error => {
            var error_message = this.translate.instant("Error Updating Device");
            if (_.has(error, "error.message"))
              error_message = error.error.message;
            this.toastr_service.error(error_message);
          }
        );
      } else {
        request = new ActionReq<Array<Devices>>();
        request.item = [this.device];
        this.device_merge_alarm_service.createDevice(request).subscribe(
          (resp: ActionRes<Array<Devices>>) => {
            if (resp.item.length > 0) {
              this.toastr_service.success(this.translate.instant("Device Inserted"));
              this.device = new Devices();
            }
          },
          error => {
            var error_message = this.translate.instant("Error Creating Device");
            if (_.has(error, "error.message"))
              error_message = error.error.message;
            this.toastr_service.error(error_message);
          }
        );
      }
    }
  }
  cancel() {
    // this.router.navigate(['devices'])
    this.location.back();
  }
}
