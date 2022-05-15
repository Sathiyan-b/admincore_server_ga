import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmMergeComponent } from './alarm-merge.component';

describe('AlarmMergeComponent', () => {
  let component: AlarmMergeComponent;
  let fixture: ComponentFixture<AlarmMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmMergeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
