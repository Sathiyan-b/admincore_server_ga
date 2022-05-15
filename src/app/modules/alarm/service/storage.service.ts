import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { rootCertificates } from "tls";
import {
  json_custom_parser,
  json_custom_stringifier,
} from "../../global/utils";
import { EnterpriseHierarchyNode } from "../models/enterprise-hierarchy-node.model";
import { EnterpriseHierarchyListModel } from "../models/enterprise.model";
import { PrivilegeModel } from "../models/privilege.model";
@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _permission_map_list: Array<PrivilegeModel> = [];
  public rooms$: BehaviorSubject<Array<EnterpriseHierarchyNode> | null> =
    new BehaviorSubject<Array<EnterpriseHierarchyNode> | null>(null);
  public beds$: BehaviorSubject<Array<EnterpriseHierarchyNode> | null> =
    new BehaviorSubject<Array<EnterpriseHierarchyNode> | null>(null);

  //   initRooms() {
  //     var room_temp = localStorage.getItem("components");
  //     if (room_temp) {
  //       this.rooms$.next(
  //         json_custom_parser.parse<Array<EnterpriseHierarchyListModel> | null>(
  //           room_temp,
  //           null
  //         )
  //       );
  //     }
  //     this.rooms$.subscribe((v) => {
  //       localStorage.setItem("components", JSON.stringify(v));
  //     });
  //   }
  //   initBeds() {
  //     var bed_temp = localStorage.getItem("components");
  //     if (bed_temp) {
  //       this.beds$.next(
  //         json_custom_parser.parse<Array<EnterpriseHierarchyListModel> | null>(
  //           bed_temp,
  //           null
  //         )
  //       );
  //     }
  //     this.beds$.subscribe((v) => {
  //       localStorage.setItem("components", JSON.stringify(v));
  //     });
  //   }
  // set permission_map_list(value: Array<PrivilegeModel>) {
  //   localStorage.setItem(
  //     "permission_map_list",
  //     json_custom_stringifier.stringify(value)
  //   );
  //   this._permission_map_list = value;
  // }
  // get permission_map_list() {
  //   if (this._permission_map_list.length == 0) {
  //     var temp = json_custom_parser.parse(
  //       localStorage.getItem("permission_map_list"),
  //       []
  //     );
  //     if (temp != null) {
  //       this._permission_map_list = temp;
  //     }
  //   }
  //   return this._permission_map_list;
  // }
}
