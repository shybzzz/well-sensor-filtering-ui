import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttDeviceSettingsDialogComponent } from './mqtt-device-settings-dialog.component';

describe('MqttDeviceSettingsDialogComponent', () => {
  let component: MqttDeviceSettingsDialogComponent;
  let fixture: ComponentFixture<MqttDeviceSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MqttDeviceSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttDeviceSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
