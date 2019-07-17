import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingTrackerComponent } from './loading-tracker.component';

describe('LoadingTrackerComponent', () => {
  let component: LoadingTrackerComponent;
  let fixture: ComponentFixture<LoadingTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
