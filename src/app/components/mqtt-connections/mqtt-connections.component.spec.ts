import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttConnectionsComponent } from './mqtt-connections.component';

describe('MqttConnectionsComponent', () => {
  let component: MqttConnectionsComponent;
  let fixture: ComponentFixture<MqttConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MqttConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
