import { Injectable } from '@angular/core';

const CurrentMqttServerId = 'currenMqtttServerId';
const CurrentMqttUserId = 'currenMqtttUserId';
const CurrentMqttDeviceId = 'currenMqtttDeviceId';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  setCurrentMqttServerId(mqttServerId: string) {
    localStorage.setItem(CurrentMqttServerId, mqttServerId);
  }

  getCurrentMqttServerId(): string {
    return localStorage.getItem(CurrentMqttServerId);
  }

  setCurrentMqttUserId(mqttUserId: string) {
    localStorage.setItem(CurrentMqttUserId, mqttUserId);
  }

  getCurrentMqttUserId(): string {
    return localStorage.getItem(CurrentMqttUserId);
  }

  setCurrentMqttDeviceId(mqttDeviceId: string) {
    localStorage.setItem(CurrentMqttDeviceId, mqttDeviceId);
  }

  getCurrentMqttDeviceId(): string {
    return localStorage.getItem(CurrentMqttDeviceId);
  }
}
