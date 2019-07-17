import { Injectable } from '@angular/core';

const CurrentMqttServerId = 'currenMqtttServerId';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  setCurrentMqttServerId(mqttServerId: string) {
    localStorage.setItem(CurrentMqttServerId, mqttServerId);
  }

  getCurrentMqttServerId(): string {
    return localStorage.getItem('currenMqtttServerId');
  }
}
