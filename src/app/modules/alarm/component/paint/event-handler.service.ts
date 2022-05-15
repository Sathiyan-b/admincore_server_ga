import { fabric } from "fabric";
import { FabricShapeService } from "./shape.service";
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
  DrawingTools,
  FabricObjectType,
  Pointer
} from "./models";
import { Injectable } from "@angular/core";
import { v4 as uuid } from "uuid";
import { FabricCanvasComponent } from "./fabric-canvas/fabric-canvas.component";
import * as _ from "lodash";

const RANGE_AROUND_CENTER = 20;

const DEFAULT_OPACITY = 0.2;
const FILLED_WITH_COLOUR_OPACITY = 0.4;

@Injectable()
export class EventHandlerService {
  public imageDataUrl: string;
  public canvas: fabric.Canvas;
  private _selectedTool: DrawingTools = DrawingTools.SELECT;
  private previousTop: number;
  private previousLeft: number;
  private previousScaleX: number;
  private previousScaleY: number;
  set selectedTool(t: DrawingTools) {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this._selectedTool = t;
    if (
      this._selectedTool === DrawingTools.SELECT ||
      this._selectedTool === DrawingTools.ERASER ||
      this._selectedTool === DrawingTools.FILL
    ) {
      this.objectsSelectable(true);
    } else {
      this.objectsSelectable(false);
    }
    if (this.selectedTool === DrawingTools.GARBAGE) {
      const background = this.canvas.backgroundImage;
      this.canvas.clear();
      this.canvas.setBackgroundImage(background, () => {});
    }
  }
  get selectedTool(): DrawingTools {
    return this._selectedTool;
  }
  _selectedColour: DrawingColours = DrawingColours.BLACK;
  set selectedColour(c: DrawingColours) {
    this._selectedColour = c;
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }
  get selectedColour(): DrawingColours {
    return this._selectedColour;
  }
  selectedThickness: DrawingThickness = DrawingThickness.THIN;
  private _isMouseDown = false;
  private _elementUnderDrawing:
    | CustomFabricEllipse
    | CustomFabricRect
    | CustomFabricPath
    | CustomFabricLine
    | CustomFabricPolygon;
  private _initPositionOfElement: Pointer;
  private json_string: string;

  constructor(private fabricShapeService: FabricShapeService) {}

  clearCanvas() {
    this.canvas.clear();
    // this.addBGImageSrcToCanvas()
  }
  convertToJSONData() {
    fabric.Object.prototype.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          text: this.text,
          name: this.name,
          fontStyle: this.fontStyle,
          fontSize: this.fontSize,
          fontFamily: this.fontFamily,
          height: this.height,
          width: this.width
        });
      };
    })(fabric.Object.prototype.toObject);
    var json = JSON.stringify(
      this.canvas.toDatalessJSON(["id", "name", "text", "height", "width"])
    );
    this.json_string = json;
    console.log("josn stringlty data ", json);
    return json;
  }
  loadJSONData(json: any) {
    if (!json) {
      return;
    }
    var jsonObject = json;
    // clear canvas
    this.canvas.clear();
    // var canvas_height = jsonObject.height;
    // var canvas_width = jsonObject.width;
    var height = document.getElementById("canvas_wrapper").offsetHeight;
    height += height*25/100
    var width = document.getElementById("canvas_wrapper").offsetWidth;
    width += width*25/100
    jsonObject.height = height
    jsonObject.width = width
    // console.log("height and width ", canvas_width, canvas_height);
    // Working code
    this.canvas.loadFromJSON(jsonObject, () => {
      fabric.Object.prototype.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            text: this.text,
            name: this.name,
            fontStyle: this.fontStyle,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily
          });
        };
      })(fabric.Object.prototype.toObject);
      // if (canvas_height && canvas_width) {
      //   // this.canvas.setDimensions(canvas_height, canvas_width);
      // }
      this.canvas.renderAll();
    });
    // this.canvas.renderAll()
  }
  createEmptyScreenView(): string {
    const rect = new fabric.Rect({
      left: 200,
      top: 195,
      strokeDashArray: [5, 5],
      strokeWidth: 1,
      stroke: "#000000",
      // backgroundColor: "white",
      fill: this.setOpacity(DrawingColours.WHITE, DEFAULT_OPACITY),
      width: 285,
      height: 100,
      selectable: false,
      hasRotatingPoint: false
    }) as CustomFabricRect;
    rect.id = uuid();

    const iText = new fabric.IText("Select Rooms to add into layout", {
      strokeWidth: DrawingThickness.THIN / 4,
      stroke: DrawingColours.BLACK,
      fill: DrawingColours.BLACK,
      fontSize: 15,
      left: rect.left + 35,
      top: rect.top + 40,
      selectable: false,
      hasRotatingPoint: false,
      text: "Select Rooms to add into layout"
      // originX:"center",
      // originY:"center",
    }) as CustomFabricIText;

    const group = new fabric.Group([rect, iText], {
      selectable: false
    });
    this.canvas.add(group);
    this.canvas.renderAll();

    return rect.id;
  }
  createRoom(name: string, id: string): string {
    console.log("name ", name, id);

    const rect = new fabric.Rect({
      left: 5,
      top: 50,
      // strokeWidth: 1,
      // stroke: "#009933",
      backgroundColor: "white",
      fill: this.setOpacity(DrawingColours.WHITE, DEFAULT_OPACITY),
      width: 80,
      height: 80,
      selectable: false,
      hasRotatingPoint: false
    }) as CustomFabricRect;
    rect.id = uuid();

    const iText = new fabric.IText(name || "Ward", {
      strokeWidth: DrawingThickness.THIN / 2,
      stroke: DrawingColours.BLUE,
      fill: DrawingColours.BLUE,
      fontSize: 15,
      left: rect.left + 5,
      top: rect.top + 5,
      selectable: false,
      hasRotatingPoint: false,
      text: name
    }) as CustomFabricIText;

    iText.id = uuid();

    fabric.Image.fromURL("assets/room_icon.png", img => {
      img.set({
        transparentCorners: false,
        cornerColor: "white",
        cornerStrokeColor: "black",
        borderColor: "black",
        cornerSize: 5,
        // padding: 5,
        cornerStyle: "circle",
        top: rect.top + 25,
        left: rect.left + 25,
        scaleX: 20 / img.width,
        scaleY: 20 / img.height
      });
      img.scaleToHeight(50);
      img.scaleToWidth(50);

      img.scale(0.5);
      const group = new fabric.Group([rect, iText, img], {
        left: 150,
        top: 100,
        name: id
      });
      fabric.Object.prototype.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            text: this.text,
            name: this.name,
            fontStyle: this.fontStyle,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily
          });
        };
      })(fabric.Object.prototype.toObject);
      this.canvas.add(group);
      this.canvas.renderAll();
    });

    return rect.id;
  }
  private setOpacity(colour: DrawingColours, to: number): string {
    const opacityOfRGBA = new RegExp("(\\d\\.\\d|\\d)\\)");
    return colour.replace(opacityOfRGBA, `${to})`);
  }
  addBGImageSrcToCanvas(): Promise<void> {
    if (!this.imageDataUrl) {
      return;
    }
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        const f_img = new fabric.Image(img);
        this.canvas.setWidth(f_img.width);
        this.canvas.setHeight(f_img.height);
        this.canvas.setBackgroundImage(f_img, resolve);
      };
      img.onerror = () => {
        reject();
      };
      img.src = this.imageDataUrl;
    });
  }

  mouseDown(e: Event) {
    this._isMouseDown = true;
    const pointer = this.canvas.getPointer(e);
    this._initPositionOfElement = { x: pointer.x, y: pointer.y };

    switch (this._selectedTool) {
      case DrawingTools.ELLIPSE:
        this._elementUnderDrawing = this.fabricShapeService.createEllipse(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          pointer
        );
        break;
      case DrawingTools.RECTANGLE:
        this._elementUnderDrawing = this.fabricShapeService.createRectangle(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          pointer
        );
        break;
      case DrawingTools.PENCIL:
        this._elementUnderDrawing = this.fabricShapeService.createPath(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          pointer
        );
        break;
      case DrawingTools.LINE:
        this._elementUnderDrawing = this.fabricShapeService.createLine(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          [5, 0],
          pointer
        );
        break;
      case DrawingTools.DASHED_LINE:
        this._elementUnderDrawing = this.fabricShapeService.createLine(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          [5, 5],
          pointer
        );
        break;
      case DrawingTools.POLYGON:
        if (!this._elementUnderDrawing) {
          this._elementUnderDrawing = this.fabricShapeService.createPolygon(
            this.canvas,
            this.selectedThickness,
            this._selectedColour,
            pointer
          );
        } else {
          if (
            this.fabricShapeService.isClickNearPolygonCenter(
              this._elementUnderDrawing as CustomFabricPolygon,
              pointer,
              RANGE_AROUND_CENTER
            )
          ) {
            this._elementUnderDrawing = this.fabricShapeService.finishPolygon(
              this.canvas,
              this._elementUnderDrawing as CustomFabricPolygon
            );
            this._elementUnderDrawing = undefined;
          } else {
            this.fabricShapeService.addPointToPolygon(
              this._elementUnderDrawing as CustomFabricPolygon,
              pointer
            );
          }
        }
        break;
      case DrawingTools.TEXT:
        this.fabricShapeService.createIText(this.canvas, {
          thickness: this.selectedThickness / 2,
          colour: this._selectedColour,
          pointer
        });
        break;
    }
  }

  mouseMove(e: Event) {
    if (!this._isMouseDown) {
      return;
    }
    const pointer = this.canvas.getPointer(e);
    switch (this._selectedTool) {
      case DrawingTools.ELLIPSE:
        this.fabricShapeService.formEllipse(
          this._elementUnderDrawing as CustomFabricEllipse,
          this._initPositionOfElement,
          pointer
        );
        break;
      case DrawingTools.RECTANGLE:
        this.fabricShapeService.formRectangle(
          this._elementUnderDrawing as CustomFabricRect,
          this._initPositionOfElement,
          pointer
        );
        break;
      case DrawingTools.PENCIL:
        this.fabricShapeService.formPath(
          this._elementUnderDrawing as CustomFabricPath,
          pointer
        );
        break;
      case DrawingTools.LINE:
      case DrawingTools.DASHED_LINE:
        this.fabricShapeService.formLine(
          this._elementUnderDrawing as CustomFabricLine,
          pointer
        );
        break;
      case DrawingTools.POLYGON:
        this.fabricShapeService.formFirstLineOfPolygon(
          this._elementUnderDrawing as CustomFabricPolygon,
          this._initPositionOfElement,
          pointer
        );
        break;
    }
    this.canvas.renderAll();
  }
  deleteSelectedObject() {
    var active_object = this.canvas.getActiveObject();
    if (active_object) {
      this.canvas.remove(active_object);
      this.canvas.renderAll();
      return active_object.toJSON().name;
    }
  }
  mouseUp() {
    this._isMouseDown = false;
    if (this._selectedTool === DrawingTools.PENCIL) {
      this._elementUnderDrawing = this.fabricShapeService.finishPath(
        this.canvas,
        this._elementUnderDrawing as CustomFabricPath
      );
    }
    if (this._selectedTool !== DrawingTools.POLYGON) {
      this._elementUnderDrawing = undefined;
    }
    if (this._selectedTool !== DrawingTools.SELECT) {
      this.canvas.renderAll();
    }
  }

  extendToObjectWithId(): void {
    fabric.Object.prototype.toObject = (function(toObject) {
      return function(this: CustomFabricObject) {
        return fabric.util.object.extend(toObject.call(this), {
          id: this.id
        });
      };
    })(fabric.Object.prototype.toObject);
  }

  objectSelected(object: CustomFabricObject): void {
    this.previousLeft = object.left;
    this.previousTop = object.top;
    this.previousScaleX = object.scaleX;
    this.previousScaleY = object.scaleY;
    console.log("_selectedTool",this._selectedTool)
    switch (this._selectedTool) {
      case DrawingTools.ERASER:
        if (object.type === FabricObjectType.ELLIPSE) {
          const otherEllipses = this.getOtherEllipses(object.id);
          otherEllipses.forEach(e => this.canvas.remove(e));
        }
        this.canvas.remove(object);
        break;
      case DrawingTools.FILL:
        this.fabricShapeService.fillShape(object, this._selectedColour);
        break;
    }
  }

  objectMoving(
    id: string,
    type: FabricObjectType,
    newLeft: number,
    newTop: number
  ) {
    if (type !== FabricObjectType.ELLIPSE) {
      return;
    }
    const diffX = newLeft - this.previousLeft;
    const diffY = newTop - this.previousTop;
    this.previousLeft = newLeft;
    this.previousTop = newTop;

    const otherEllipses = this.getOtherEllipses(id);
    otherEllipses.forEach(e => {
      e.left += diffX;
      e.top += diffY;
    });
  }

  objectScaling(
    id: string,
    type: FabricObjectType,
    newScales: { x: number; y: number },
    newCoords: { left: number; top: number }
  ) {
    if (type !== FabricObjectType.ELLIPSE) {
      return;
    }
    const scaleDiffX = newScales.x - this.previousScaleX;
    const scaleDiffY = newScales.y - this.previousScaleY;
    this.previousScaleX = newScales.x;
    this.previousScaleY = newScales.y;

    const otherEllipses = this.getOtherEllipses(id);
    otherEllipses.forEach(e => {
      e.scaleX += scaleDiffX;
      e.scaleY += scaleDiffY;
    });
    this.objectMoving(id, type, newCoords.left, newCoords.top);
  }

  private objectsSelectable(isSelectable: boolean) {
    this.canvas.forEachObject(obj => {
      obj.selectable = isSelectable;
    });
  }

  private getOtherEllipses(notIncludedId: string): CustomFabricEllipse[] {
    return this.canvas
      .getObjects(FabricObjectType.ELLIPSE)
      .filter(
        e => (e as CustomFabricEllipse).id !== notIncludedId
      ) as CustomFabricEllipse[];
  }
}
