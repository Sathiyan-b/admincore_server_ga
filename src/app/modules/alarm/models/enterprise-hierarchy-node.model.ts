export class EnterpriseHierarchyNode {
  id: string = "";
  type: string = "";
  elementid: number = 0;  
  name: string | null = null;
  poc_name?:string|null=null
  parent_id: number | string = null;
  children: Array<EnterpriseHierarchyNode> | null = null;
}
export class HierarchyNodeEvent {
  type: HierarchyNodeEvent.Type | null = null;
  node: EnterpriseHierarchyNode | null = null;
}
export namespace HierarchyNodeEvent {
  export enum Type {
    AddRoom,
    SelectNode,
    Move,
    Paste
  }
  export class Menu {
    type: Type | null = null;
    name: string | null = null;
  }
}
