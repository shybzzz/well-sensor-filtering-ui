import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttDeviceComponent } from './mqtt-device.component';

describe('MqttDeviceComponent', () => {
  let component: MqttDeviceComponent;
  let fixture: ComponentFixture<MqttDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MqttDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
