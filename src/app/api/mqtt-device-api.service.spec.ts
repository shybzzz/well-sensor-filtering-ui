import { TestBed } from '@angular/core/testing';

import { MqttDeviceApiService } from './mqtt-device-api.service';

describe('MqttDeviceApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MqttDeviceApiService = TestBed.get(MqttDeviceApiService);
    expect(service).toBeTruthy();
  });
});
