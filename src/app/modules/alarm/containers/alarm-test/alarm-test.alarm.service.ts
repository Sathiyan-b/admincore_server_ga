import { Injectable } from "@angular/core";
import { HttpClientHelper } from "src/app/modules/global/service/helpers/HttpClientHelper";
import { environment } from "src/environments/environment";
import { Devices } from "../../models/devices.model";
import { ReferenceListModel } from "../../models/referencelist.model";
import { IVGatewayAssociationWrapper } from "../../models/ivgateway.model";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { PatientOrders } from '../../models/patientorders.model';

@Injectable({
  providedIn: "root"
})
export class AlarmTestAlarmService {
  private SERVER_URL = environment.alarm_base_url;
  constructor(private httpClient: HttpClientHelper) {}
  public getdevice(request: ActionReq<Devices>) {
    return this.httpClient.post(this.SERVER_URL + `/devices/get`, request);
  }
  public updateDevice(request: ActionReq<Devices>) {
    return this.httpClient.put(this.SERVER_URL + `/devices`, request);
  }
  public createDevice(request: ActionReq<Array<Devices>>) {
    return this.httpClient.post(
      this.SERVER_URL + `/devices/createinbulk`,
      request
    );
  }
  public createAlarm(request: IVGatewayAssociationWrapper) {
    var req: ActionReq<IVGatewayAssociationWrapper> = new ActionReq<
      IVGatewayAssociationWrapper
    >();
    req.item = request;
    return this.httpClient.post(
      this.SERVER_URL + `/alarmobservations/createAlarm`,
      req
    );
  }
  public getPatientAndVisit(patient_identifier: string) {
    return this.httpClient.get(
      this.SERVER_URL +
        `/patientvisits/getPatientAndVisit/${patient_identifier}`
    );
  }
  public getPatientAndVisitForOrderCode(order_code: string) {
    return this.httpClient.get(
      this.SERVER_URL +
        `/patientvisits/getPatientAndVisitForOrderCode/${order_code}`
    );
  }
  public getAssociatedOrdersForDevices(device_id: number) {
    return this.httpClient.get(
      this.SERVER_URL +
        `/patientvisits/getAssociatedOrdersForDevices/${device_id}`
    );
  }
  public startOrder(request: any) {
    var req: ActionReq<PatientOrders> = new ActionReq<PatientOrders>();
    req.item = request;
    return this.httpClient.post(
      this.SERVER_URL + `/patientorders/startorder`,
      req
    );
  }
}
