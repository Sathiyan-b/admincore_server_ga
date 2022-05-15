import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { Devices } from "../../models/devices.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import {
  PatientMedicationsWrapper,
  PatientMedicationsCriteria
} from "../../models/patientmedications.model";

@Injectable({
  providedIn: "root"
})
export class PatientMediactionsAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getMedicationsForpatient(
    request: ActionReq<PatientMedicationsCriteria>
  ) {
    return this.httpClient.post(
      this.SERVER_URL + `/patientmedications/getmedicationsforPatient`,
      request
    );
  }
  public createOrder(request: string) {
    var _req = new ActionReq<string>();
    _req.item = request;

    return this.httpClient.post(
      this.SERVER_URL + `/alarmobservations/createOrder`,
      _req
    );
  }
}
