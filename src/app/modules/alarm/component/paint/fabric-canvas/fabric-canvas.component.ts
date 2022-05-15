import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  NgZone,
} from "@angular/core";
import { fabric } from "fabric";
import { EventHandlerService } from "../event-handler.service";
import { v4 as uuid } from "uuid";

import {
  CustomFabricEllipse,
  CustomFabricIText,
  CustomFabricLine,
  CustomFabricObject,
  CustomFabricPath,
  CustomFabricPolygon,
  CustomFabricRect,
  DrawingColours,
  DrawingThickness,
  FabricObjectType,
  Pointer,
} from "../models";
import { EnterpriseHierarchyAlarmService } from "../../../containers/enterprise-hierarchy/enterprisehierarchy.alarm.service";
import { PointofcareModel } from "../../../models/pointofcare.model";
import { StorageService } from "../../../service/storage.service";
import * as _ from "lodash";

const DEFAULT_OPACITY = 0.2;
const FILLED_WITH_COLOUR_OPACITY = 0.4;

@Component({
  selector: "app-fabric-canvas",
  templateUrl: "./fabric-canvas.component.html",
  styleUrls: ["./fabric-canvas.component.scss"],
})
export class FabricCanvasComponent implements AfterContentInit, AfterViewInit {
  canvas: fabric.Canvas;

  @Input() set imageDataURL(v: string) {
    if (v) {
      this.eventHandler.imageDataUrl = v;
    }
  }
  ward_id: number = 0;
  constructor(
    private eventHandler: EventHandlerService,
    private ngZone: NgZone,
    private enterprise_service: EnterpriseHierarchyAlarmService,
    private storage_service: StorageService
  ) {
    storage_service.rooms$.subscribe((resp) => {
      if (resp != null) {
        var ward_id = _.get(resp[0], "parent_id", "").toString().split("_")[1];
        this.ward_id = parseInt(ward_id);
      }
    });
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.eventHandler.canvas) {
        this.eventHandler.canvas.dispose();
      }
      this.canvas = new fabric.Canvas("canvas", {
        selection: false,
        preserveObjectStacking: true,
        height:490,
        width:790
      });
      this.eventHandler.canvas = this.canvas;
      this.eventHandler.extendToObjectWithId();
      fabric.Object.prototype.objectCaching = false;
      this.addEventListeners();
    });
  }

  ngAfterViewInit() {
    // this.eventHandler.addBGImageSrcToCanvas();
  }
  async convertToJSOn() {
    var json_data = await this.eventHandler.convertToJSONData();
    if (this.ward_id != 0) {
      var resp = await this.enterprise_service.updateMapData(
        new PointofcareModel({ id: this.ward_id, map_data: json_data })
      );
    }
    console.log("JSON data ", resp);
  }
  async loadJSONData(){
    this.eventHandler.loadJSONData("")
  }

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
    this.eventHandler.deleteSelectedObject();
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

  // InitializeIntractJS=()=>{
  //   this.canvas
  //   if(this.canvas ==null){
  //     var canvasWrapper = document.getElementById('canvas-wrapper');
  //     canvasWrapper.tabIndex = 1000;
  //     canvasWrapper.addEventListener("keydown", $scope.processKeys, false);
  //     canvasWrapper.addEventListener("click", function (evt) {
  //         evt = evt || window.event;
  //         if (evt.srcElement.id == 'canvas-wrapper') {
  //             $scope.canvas.discardActiveObject();
  //             $scope.canvas.renderAll();
  //         }
  //     }, false);
  //   }
  // }
}
