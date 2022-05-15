import { Component } from "@angular/core";
import * as _ from "lodash";
import { EnterpriseHierarchyAlarmService } from "../../../containers/enterprise-hierarchy/enterprisehierarchy.alarm.service";
import { EnterpriseHierarchyNode } from "../../../models/enterprise-hierarchy-node.model";
import { PointofcareModel } from "../../../models/pointofcare.model";
import { StorageService } from "../../../service/storage.service";
import { EventHandlerService } from "../event-handler.service";
import { DrawingTools } from "../models";

@Component({
  selector: "app-graphical-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class GraphicalToolbarComponent {
  options: Array<EnterpriseHierarchyNode> = [];
  DrawingTools = DrawingTools;
  selected = this.fabricService.selectedTool;
  json_data: any;
  ward_id: number = 0;
  selected_list: Array<EnterpriseHierarchyNode> = [];

  constructor(
    private fabricService: EventHandlerService,
    private storage_service: StorageService,
    private enterprise_service: EnterpriseHierarchyAlarmService
  ) {
    this.getData();
  }
  getData = async () => {
    this.storage_service.rooms$.subscribe(async (resp) => {
      if (resp != null) {
        this.options = resp;
        this.ward_id = _.get(resp[0], "elementid", 0);
        var _resp = await this.enterprise_service.getMapData(
          new PointofcareModel({ id: this.ward_id })
        );
        console.log("get resp ward options ", _resp);
        this.fabricService.clearCanvas();
      }
    });
    this.storage_service.beds$.subscribe((resp) => {
      if (resp != null) {
        this.options = resp;
        this.fabricService.clearCanvas();
      }
    });
  };

  async select(tool: DrawingTools) {
    this.fabricService.selectedTool = tool;
    this.selected = this.fabricService.selectedTool;
  }
  async onSelect() {
    this.fabricService.createRoom("NICU","");
    this.select(DrawingTools.SELECT);
  }
  async onDelete(option: EnterpriseHierarchyNode) {
   var result = await this.fabricService.deleteSelectedObject();
  //  if(result){

  //  }
  }
  async addImage() {
    this.fabricService.addBGImageSrcToCanvas();
  }
  async convertToJSOn() {
    this.json_data = this.fabricService.convertToJSONData();
    this.enterprise_service.updateMapData(
      new PointofcareModel({ id: this.ward_id, map_data: this.json_data })
    );
    console.log("JSON data ", this.json_data);
  }
  async loadJSONData() {
    console.log("JSON dataloadJSONdata ", this.json_data);
    this.fabricService.loadJSONData(this.json_data);
  }
  onSelectRoom(option: EnterpriseHierarchyNode) {
    console.log("room name ", option.name);
    this.fabricService.createRoom(option.name.toString(),option.elementid.toString());
    this.selected_list.push(option);
    var index = _.findIndex(this.options, (v) => {
      return v.id == option.id;
    });
    if (index != -1) {
      this.options.splice(index, 1);
    }
    this.select(DrawingTools.SELECT);
  }
}
