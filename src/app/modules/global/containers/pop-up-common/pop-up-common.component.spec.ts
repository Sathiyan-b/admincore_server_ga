import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCommonComponent } from './pop-up-common.component';

describe('PopUpCommonComponent', () => {
  let component: PopUpCommonComponent;
  let fixture: ComponentFixture<PopUpCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
