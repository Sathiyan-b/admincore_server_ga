import { Component, NgZone } from "@angular/core";
import { EnterpriseHierarchyAlarmService } from "../../containers/enterprise-hierarchy/enterprisehierarchy.alarm.service";
import { StorageService } from "../../service/storage.service";
import { EventHandlerService } from "./event-handler.service";
import { fabric } from "fabric";
import * as _ from "lodash";
import { PointofcareModel } from "../../models/pointofcare.model";
import { CustomFabricObject, DrawingTools } from "./models";
import { EnterpriseHierarchyNode } from "../../models/enterprise-hierarchy-node.model";
import { ToastrService } from "ngx-toastr";
import { PrivilegePermissions } from "src/app/modules/global/model/permission.model";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";

@Component({
  selector: "app-paint",
  templateUrl: "./paint.component.html",
  styleUrls: ["./paint.component.scss"],
})
export class PaintComponent {
  title: string = "";
  canvas: fabric.Canvas;
  imageDataURL = "assets/background.jpeg";

  options: Array<EnterpriseHierarchyNode> = [];
  DrawingTools = DrawingTools;
  selected = this.eventHandler.selectedTool;
  json_data: any;
  ward_id: number = 0;
  selected_list: Array<EnterpriseHierarchyNode> = [];

  constructor(
    private eventHandler: EventHandlerService,
    private ngZone: NgZone,
    private enterprise_service: EnterpriseHierarchyAlarmService,
    private storage_service: StorageService,
    private toaster_service: ToastrService,
    public user_permission_guard: UserPermissionGuardService
  ) {
    this.getData();
    // storage_service.rooms$.subscribe((resp) => {
    //   if (resp != null) {
    //     var ward_id = _.get(resp[0], "parent_id", "").toString().split("_")[1];
    //     this.ward_id = parseInt(ward_id);
    //   }
    // });
  }

  getData = async () => {
    this.storage_service.rooms$.subscribe(async (resp) => {
      if (resp != null) {
        if (resp.length == 0) {
          this.options = [];
          this.selected_list = [];
          this.eventHandler.clearCanvas();
          this.eventHandler.createEmptyScreenView();
          return;
        }
        this.title = _.get(resp[0], "poc_name", "");
        var ward_id = _.get(resp[0], "parent_id", "").toString().split("_")[1];
        this.ward_id = parseInt(ward_id);
        var _resp = await this.enterprise_service.getMapData(
          new PointofcareModel({ id: this.ward_id })
        );
        if (_resp.length > 0) {
          this.options = [];
          this.selected_list = [];
          var json_data = JSON.parse(_.get(_resp[0], "map_data", ""));
          if (json_data != null) {
            /* finding selected object  */
            _.forEach(json_data.objects, (v1) => {
              var obj = _.find(resp, (v2) => {
                return v2.id == v1.name;
              });
              if (obj != undefined) {
                this.selected_list.push(obj);
              }
            });

            _.forEach(resp, (v1) => {
              var obj = _.find(this.selected_list, (v2) => {
                return v2.id == v1.id;
              });
              if (obj == undefined) {
                this.options.push(v1);
              }
            });
            this.eventHandler.loadJSONData(json_data);
          } else {
            this.options = resp;
          }
        }
        this.eventHandler.clearCanvas();
        if (this.selected_list.length == 0) {
          this.eventHandler.createEmptyScreenView();
        }
      }
    });
  };

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.eventHandler.canvas) {
        this.eventHandler.canvas.dispose();
      }
      var height = document.getElementById("canvas_wrapper").offsetHeight;
      height += (height * 25) / 100;
      var width = document.getElementById("canvas_wrapper").offsetWidth;
      width += (width * 25) / 100;
      this.canvas = new fabric.Canvas("canvas", {
        selection: false,
        preserveObjectStacking: true,
        height,
        width,
      });
      this.eventHandler.canvas = this.canvas;
      this.eventHandler.extendToObjectWithId();
      this.eventHandler.createEmptyScreenView();
      fabric.Object.prototype.objectCaching = false;

      this.addEventListeners();
    });
  }

  ngAfterViewInit() {
    // this.eventHandler.addBGImageSrcToCanvas();
  }
  // async convertToJSOn() {
  //   var json_data = await this.eventHandler.convertToJSONData();
  //   if (this.ward_id != 0) {
  //     var resp = await this.enterprise_service.updateMapData(
  //       new PointofcareModel({ id: this.ward_id, map_data: json_data })
  //     );
  //   }
  //   console.log("JSON data ", resp);
  // }

  private addEventListeners() {
    this.canvas.on("mouse:down", (e) =>
      this.ngZone.run(() => this.onCanvasMouseDown(e))
    );
    this.canvas.on("mouse:move", (e) =>
      this.ngZone.run(() => this.onCanvasMouseMove(e))
    );
    this.canvas.on("mouse:up", () =>
      this.ngZone.run(() => this.onCanvasMouseUp())
    );
    this.canvas.on("selection:created", (e) =>
      this.ngZone.run(() => this.onSelectionCreated(e as any))
    );
    this.canvas.on("selection:updated", (e) =>
      this.ngZone.run(() => this.onSelectionUpdated(e as any))
    );
    this.canvas.on("object:moving", (e) =>
      this.ngZone.run(() => this.onObjectMoving(e as any))
    );
    this.canvas.on("object:scaling", (e) =>
      this.ngZone.run(() => this.onObjectScaling(e as any))
    );
  }
  async onDelete() {
    var result = await this.eventHandler.deleteSelectedObject();
    if (result) {
      var index = _.findIndex(this.selected_list, (v) => {
        return v.id == result;
      });
      if (index != -1) {
        this.options.unshift(this.selected_list[index]);
        this.selected_list.splice(index, 1);
      }
      if (this.selected_list.length == 0) {
        this.eventHandler.createEmptyScreenView();
      }
    }
  }
  private onCanvasMouseDown(event: { e: Event }) {
    this.eventHandler.mouseDown(event.e);
    this.avoidDragAndClickEventsOfOtherUILibs(event.e);
  }
  private onCanvasMouseMove(event: { e: Event }) {
    this.eventHandler.mouseMove(event.e);
  }
  private onCanvasMouseUp() {
    this.eventHandler.mouseUp();
  }
  private onSelectionCreated(e: { target: CustomFabricObject }) {
    fabric.Object.prototype.set({
      borderColor: "blue",
      cornerColor: "blue",
      cornerSize: 6,
      transparentCorners: true,
      borderDashArray: [4, 4],
      rotatingPointOffset: 20,
    });
    this.eventHandler.objectSelected(e.target);
  }
  private onSelectionUpdated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
  }
  private onObjectMoving(e: any) {
    this.eventHandler.objectMoving(
      e.target.id,
      e.target.type,
      e.target.left,
      e.target.top
    );
    // console.log("mousemove",e.target.left,document.getElementById("canvas_wrapper").offsetWidth,e.target.top,document.getElementById("canvas_wrapper").offsetHeight)
    if (
      e.target.left < -1 ||
      e.target.top < -1 ||
      e.target.left >
        document.getElementById("canvas_wrapper").offsetWidth + 100 ||
      e.target.top > document.getElementById("canvas_wrapper").offsetHeight + 60
    ) {
      this.onDelete();
    }
  }
  private onObjectScaling(e: any) {
    this.eventHandler.objectScaling(
      e.target.id,
      e.target.type,
      { x: e.target.scaleX, y: e.target.scaleY },
      { left: e.target.left, top: e.target.top }
    );
  }

  private avoidDragAndClickEventsOfOtherUILibs(e: Event) {
    e.stopPropagation();
  }
  // getData = async () => {
  //   this.storage_service.rooms$.subscribe(async (resp) => {
  //     if (resp != null) {
  //       this.options = resp;
  //       this.ward_id = _.get(resp[0], "elementid", 0);
  //       var _resp = await this.enterprise_service.getMapData(
  //         new PointofcareModel({ id: this.ward_id })
  //       );
  //       console.log("get resp ward options ", _resp);
  //       this.eventHandler.clearCanvas();
  //     }
  //   });
  //   this.storage_service.beds$.subscribe((resp) => {
  //     if (resp != null) {
  //       this.options = resp;
  //       this.eventHandler.clearCanvas();
  //     }
  //   });
  // };

  async select(tool: DrawingTools) {
    this.eventHandler.selectedTool = tool;
    this.selected = this.eventHandler.selectedTool;
  }
  async onSelect() {
    this.eventHandler.createRoom("NICU", "");
    this.select(DrawingTools.SELECT);
  }
  // async onDelete(option: EnterpriseHierarchyNode) {
  //  var result = await this.eventHandler.deleteSelectedObject();
  //  if(result){

  //  }
  // }
  async addImage() {
    this.eventHandler.addBGImageSrcToCanvas();
  }
  async convertToJSOn() {
    this.json_data = await this.eventHandler.convertToJSONData();
    try {
      this.enterprise_service.updateMapData(
        new PointofcareModel({ id: this.ward_id, map_data: this.json_data })
      );
      this.toaster_service.success(" Point of Care Layout saved successfully");
    } catch (error) {}
  }
  async loadJSONData() {
    this.eventHandler.loadJSONData(this.json_data);
  }
  onSelectRoom(option: EnterpriseHierarchyNode) {
    console.log("option", option);
    if (this.selected_list.length == 0) {
      this.canvas.clear();
    }
    this.eventHandler.createRoom(option.name.toString(), option.id);
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
