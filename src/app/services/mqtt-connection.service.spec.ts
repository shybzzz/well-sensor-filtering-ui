import { TestBed } from '@angular/core/testing';

import { MqttConnectionService } from './mqtt-connection.service';

describe('MqttConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MqttConnectionService = TestBed.get(MqttConnectionService);
    expect(service).toBeTruthy();
  });
});
