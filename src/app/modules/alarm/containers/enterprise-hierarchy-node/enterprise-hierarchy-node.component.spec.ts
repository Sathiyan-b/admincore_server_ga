import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseHierarchyNodeComponent } from './enterprise-hierarchy-node.component';

describe('EnterpriseHierarchyNodeComponent', () => {
  let component: EnterpriseHierarchyNodeComponent;
  let fixture: ComponentFixture<EnterpriseHierarchyNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterpriseHierarchyNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseHierarchyNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
