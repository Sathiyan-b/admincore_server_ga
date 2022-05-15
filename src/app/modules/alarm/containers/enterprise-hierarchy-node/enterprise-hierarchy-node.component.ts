import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChange,
} from "@angular/core";
import * as _ from "lodash";
import {
  EnterpriseHierarchyNode,
  HierarchyNodeEvent,
} from "../../models/enterprise-hierarchy-node.model";
import { EnterpriseHierarchyNodeService } from "./enterprise-hierarchy-node.service";
import * as $ from "jquery";
@Component({
  selector: "app-enterprise-hierarchy-node",
  templateUrl: "./enterprise-hierarchy-node.component.html",
  styleUrls: ["./enterprise-hierarchy-node.component.scss"],
})
export class EnterpriseHierarchyNodeComponent implements OnInit {
  constructor(public _service: EnterpriseHierarchyNodeService) {}

  @Input() enterprise_nodes: Array<EnterpriseHierarchyNode> = [];
  @Input() id: number | string = null;
  @Input() service: EnterpriseHierarchyNodeService | null = null;
  @Output() onHierarchyNodeEvent = new EventEmitter<HierarchyNodeEvent>();
  selected_node: EnterpriseHierarchyNode | null = null;
  is_root: boolean = false;
  show_children: boolean = false;
  has_child: boolean = false;
  node: EnterpriseHierarchyNode | null = null;
  menu_list: Array<HierarchyNodeEvent.Menu> = [];
  ngOnInit(): void {
    // console.log("enterprise hierarchy node ngoninit ",this.enterprise_nodes)
    this.init();
  }
  ngOnChanges(changes: any) {
    if (changes.enterprise_nodes.previousValue != undefined) {
      this.enterprise_nodes = changes.enterprise_nodes.currentValue
      this.init();
    }
    // changes.prop contains the old and the new value...
  }
  init() {
    // console.log("enterprise hierarchy node ",this.enterprise_nodes)
    if (this.id == null) {
      this.is_root = true;
    }
    if (this.is_root) {
      this._service.events.subscribe(this.sendToParent);
      this.service = this._service;
    }
    if (this.service) this.service.events.subscribe(this.handleEvent);

    let node = _.find(this.enterprise_nodes, (v, k) => {
      return this.id == null ? v.parent_id == null : v.id == this.id;
    });
    if (node) {
      let children = _.filter(this.enterprise_nodes, (v, k) => {
        return v.parent_id == node.id;
      });
      if (children && children.length > 0) {
        node.children = children;
        this.has_child = true;
      }
      this.node = node;
    }
    // this.node =this.enterprise_nodes[0]
    this.menu_list = [
      {
        type: HierarchyNodeEvent.Type.AddRoom,
        name: "Add Room",
      },
    ];
    // this.menu_list.push({
    //   type: HierarchyNodeEvent.Type.AddRoom,
    //   name: "Add Room",
    // });
    // this.menu_list.push({
    //   type: HierarchyNodeEvent.Type.AddRoom,
    //   name: "Add Room",
    // });
    // console.log("node list ",this.node)
  }
  sendToParent = (event: HierarchyNodeEvent) => {
    console.log(" sendToParent",event)

    if (event.type == null) {
      return;
    }
    // alert(event.node?.name)
    // this.onHierarchyNodeEvent.emit(event);
  };
  handleEvent = (event: HierarchyNodeEvent) => {
    this.hideMenu();
    switch (event.type) {
      case HierarchyNodeEvent.Type.SelectNode:
        this.selected_node = event.node;
        break;
      default:
        break;
    }
  };
  toggleChildren() {
    this.show_children = !this.show_children;
  }
  selectNode() {
    let event: HierarchyNodeEvent = new HierarchyNodeEvent();
    event.type = HierarchyNodeEvent.Type.SelectNode;
    event.node = this.node;
    this.service.events.next(event);
  }
  hideMenu() {
    $(".hierarchy-node-context-menu").removeClass("show").hide();
  }
  onRightClick(e: Event) {
    this.hideMenu();
    let context_menu_trigger_id: string = `#context-menu-trigger-${this.node.id}`;
    let context_menu_id: string = `#context-menu-${this.node.id}`;
    $(context_menu_trigger_id).on("click", () => {
      $(context_menu_id).removeClass("show").hide();
    });
    $(context_menu_id)
      .css({
        display: "block",
      })
      .addClass("show");
    return false;
  }
  handleMenuClick(menu: HierarchyNodeEvent.Menu) {
    let event: HierarchyNodeEvent = new HierarchyNodeEvent();
    event.type = menu.type;
    event.node = this.node;
    this.service.events.next(event)
  }
}
