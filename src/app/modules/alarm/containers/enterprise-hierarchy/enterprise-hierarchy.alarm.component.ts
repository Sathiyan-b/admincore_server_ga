import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  Formatter,
  OnEventArgs
} from "angular-slickgrid";
import {
  TREE_ACTIONS,
  KEYS,
  IActionMapping,
  ITreeOptions,
  TreeComponent
} from "@circlon/angular-tree-component";

import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { EnterpriseModel } from "../../models/enterprise.model";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import * as _ from "lodash";
import {
  EnterpriseHierarchyNode,
  HierarchyNodeEvent
} from "../../models/enterprise-hierarchy-node.model";
import { EnterpriseHierarchyAlarmService } from "./enterprisehierarchy.alarm.service";
import { EntHierarchyCriteria } from "../../models/enthierarchy.model";
import { StorageService } from "../../service/storage.service";
@Component({
  selector: "alarm-enterprise-hierarchy",
  templateUrl: "./enterprise-hierarchy.alarm.component.html",
  styleUrls: ["./enterprise-hierarchy.alarm.component.css"]
})
export class EnterpriseHierarchyAlarmComponent implements OnInit {
  options: ITreeOptions;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private enterprise_hierarchy_service: EnterpriseHierarchyAlarmService,
    private storage_service: StorageService
  ) {
    this.storage_service.rooms$.next([]);
  }

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  async ngOnInit() {
    // this.generateTree();
    await this.orderData();
    this.getData();
  }
  title = "angular-tree";
  show_canvas: boolean = false;
  data: Array<EnterpriseHierarchyNode> = [];
  active_custom_menu_id: string | null = null;
  active_menu_id: string | null = null;
  copy_node: EnterpriseHierarchyNode = new EnterpriseHierarchyNode();
  menu_list: Array<HierarchyNodeEvent.Menu> = [
    { type: HierarchyNodeEvent.Type.AddRoom, name: "Add Room" },
    { type: HierarchyNodeEvent.Type.Move, name: "Move" }
  ];
  async getData() {
    var resp = await this.enterprise_hierarchy_service.getEnterpriseHierarchyList();
    var List = [];
    var flatList = [];
    resp.forEach(element => {
      var currentHL: EnterpriseHierarchyNode = List.find(function(item) {
        return item.elementid == element.eid;
      });
      if (typeof currentHL == "undefined") {
        currentHL = {
          type: "HL",
          id: "HL_" + element.eid,
          elementid: element.eid,
          name: element.enterprisename,
          parent_id: "ROOT",
          children: []
        };
        List.push(currentHL);
        flatList.push(currentHL);
      }

      if (element.pointofcare_id == 0) return;

      var currentPOC = currentHL.children.find(function(item) {
        return item.elementid == element.pointofcare_id;
      });
      if (typeof currentPOC == "undefined") {
        currentPOC = {
          type: "WARD",
          id: "WARD_" + element.pointofcare_id,
          elementid: element.pointofcare_id,
          name: element.pocname,
          parent_id: currentHL.id,
          children: []
        };
        currentHL.children.push(currentPOC);
        flatList.push(currentPOC);
      }

      if (element.room_id == 0) return;
      var currentRoom = currentPOC.children.find(function(item) {
        return item.elementid == element.room_id;
      });
      if (typeof currentRoom == "undefined") {
        currentRoom = {
          type: "ROOM",
          id: "ROOM_" + element.room_id,
          elementid: element.room_id,
          name: element.roomname,
          poc_name: currentPOC.name,
          parent_id: currentPOC.id,
          children: []
        };
        currentPOC.children.push(currentRoom);
        flatList.push(currentRoom);
      }

      if (element.bedid > 0) {
        var bed = {
          type: "BED",
          id: "BED_" + element.bedid,
          elementid: element.bedid,
          name: element.bedname,
          parent_id: currentRoom.id,
          children: null
        };
        currentRoom.children.push(bed);
        flatList.push(bed);
      }
    });

    // this.data = resp.map((v1, k) => {
    //   var node: EnterpriseHierarchyNode = new EnterpriseHierarchyNode();
    //   node.id = v1.id;
    //   node.name = v1.display_text.toString();
    //   node.parent_id = k == 0 ? null : v1.parent_id;
    //   return node;
    // });
    flatList.unshift({
      type: "ROOT",
      id: "ROOT",
      elementid: 0,
      name: "Enterprise",
      parent_id: null,
      children: null
    });
    this.data = List;
    // this.dataSource.data = List;
  }
  orderData = () => {
    var options: ITreeOptions = {
      displayField: "name",
      isExpandedField: "expanded",
      idField: "uuid",
      hasChildrenField: "nodes",
      actionMapping: {
        mouse: {
          click: (tree, node, $event) => {
            if (node.data.type == "WARD") {
              this.show_canvas = true;
              this.storage_service.rooms$.next(node.data.children);
            } else {
              this.show_canvas = false;
              this.storage_service.rooms$.next([]);
            }
            if (this.active_custom_menu_id) {
              $(this.active_custom_menu_id).hide();
            }
          },
          dblClick: (tree, node, $event) => {
            if (node.hasChildren)
              TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          },
          contextMenu: (tree, node, $event) => {
            $event.preventDefault();
            this.openMenuList(tree, node, $event);
          }
        },
        keys: {
          [KEYS.ENTER]: (tree, node, $event) => {
            node.expandAll();
          }
        }
      },
      nodeHeight: 23,
      // allowDrag: (node) => {
      //   return true;
      // },
      allowDrop: node => {
        return true;
      },
      allowDragoverStyling: true,
      levelPadding: 10,
      useVirtualScroll: true,
      animateExpand: true,
      scrollOnActivate: true,
      animateSpeed: 30,
      animateAcceleration: 1.2,
      scrollContainer: document.documentElement // HTML
    };
    this.options = options;
  };
  openMenuList = (tree, node, $event) => {
    // console.log("node event ", node.data);

    if (this.active_custom_menu_id) {
      $(this.active_custom_menu_id).hide();
    }
    var menu_id = "#custom_menu" + node.data.id;
    this.active_custom_menu_id = menu_id;
    $(menu_id).show();
  };
  handleNodeClick(data: EnterpriseHierarchyNode) {
    if (this.active_menu_id != null) {
      $(this.active_menu_id).css("background-color", "white");
      $(this.active_menu_id).css("color", "black");
      $(this.active_menu_id).css("padding", "0px");
      $(this.active_menu_id).css("border-radius", "0px");
    }
    // if (data.type == "WARD") {
      var menu_id = "#menu" + data.id;
      $(menu_id).css("background-color", "blue");
      $(menu_id).css("color", "white");
      $(menu_id).css("padding", "5px");
      $(menu_id).css("border-radius", "5px");
      this.active_menu_id = menu_id;
    // }
  }
  handleMenuClick(
    menu: HierarchyNodeEvent.Menu,
    data: EnterpriseHierarchyNode
  ) {
    // console.log("on menu click ", menu, data, this.copy_node.id);
    switch (menu.type) {
      case HierarchyNodeEvent.Type.AddRoom:
        var push_data = new EnterpriseHierarchyNode();
        push_data.id = data.id + data.children.length + 2;
        push_data.name = "New Child";
        push_data.elementid = data.children.length + 2;
        push_data.parent_id = data.id;
        push_data.type = _.get(data, "children[0].type", "");
        push_data.children = [];
        data.children.push(push_data);
        break;
      case HierarchyNodeEvent.Type.Move:
        // Adding copy content
        this.menu_list.pop();
        this.menu_list.push({
          type: HierarchyNodeEvent.Type.Paste,
          name: "Paste here"
        });
        this.copy_node = data;
        break;

      case HierarchyNodeEvent.Type.Paste:
        if (this.copy_node.id.length != 0) {
          // Moving data
          this.copy_node.parent_id = data.id;
          data.children.push(this.copy_node);
          this.menu_list.pop();
          this.menu_list.push({
            type: HierarchyNodeEvent.Type.Move,
            name: "Move"
          });
          // Clearing copy content
          this.copy_node = new EnterpriseHierarchyNode();
        }
        break;

      default:
        break;
    }
    // console.log(" pushed data ", data);
    this.tree.treeModel.update();

    var menu_id = "#custom_menu" + data.id;
    $(menu_id).hide();
  }
  generateTree() {
    _.forEach(new Array(100), (v, k) => {
      let node: EnterpriseHierarchyNode = new EnterpriseHierarchyNode();
      // node.id = k + 1;
      node.name = `Node ${k + 1}`;
      if (k > 0) node.parent_id = _.ceil(Math.random() * k);
      node.children = null;
      this.data.push(node);
    });
    // console.log(JSON.stringify(this.data));

    // let tree: Array<EnterpriseHierarchyNode> | null =
    //   this.constructHierarchy(data);
  }
  onHierarchyNodeEvent(e: HierarchyNodeEvent) {
    // alert(e.node.name);
    if (e.type == HierarchyNodeEvent.Type.AddRoom) {
      // console.log("new data ", e);
      var temp_data = _.cloneDeep(this.data);
      let node: EnterpriseHierarchyNode = new EnterpriseHierarchyNode();
      node.id = (this.data.length + 1).toString();
      node.name = "new room";
      node.parent_id = e.node.id.toString();
      temp_data.push(node);
      // this.data = [];
      // setTimeout(() => {
      this.data = temp_data;
      // }, 100);
    }
    if (e.type == HierarchyNodeEvent.Type.SelectNode) {
      // console.log("enterprise hierarchy ", e.node.children);
      if (e.node.type == "WARD") {
        this.show_canvas = true;
        this.storage_service.rooms$.next(e.node.children);
      } else if (e.node.type == "ROOM") {
        this.storage_service.beds$.next(e.node.children);
      }
    }
  }
}
