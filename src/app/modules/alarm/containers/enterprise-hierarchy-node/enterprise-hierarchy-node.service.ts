import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HierarchyNodeEvent } from '../../models/enterprise-hierarchy-node.model';

@Injectable({
  providedIn: 'root',
})
export class EnterpriseHierarchyNodeService {
  events: BehaviorSubject<HierarchyNodeEvent> = new BehaviorSubject(
    new HierarchyNodeEvent()
  );
  constructor() {}
}
