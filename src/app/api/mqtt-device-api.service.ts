import { MqttUser } from './../model/mqtt-user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MqttServer } from '../model/mqtt-server';
import { MqttDevice } from '../model/mqtt-device';

const api = 'https://prop99pv12.execute-api.eu-west-1.amazonaws.com/dev';

@Injectable({
  providedIn: 'root'
})
export class MqttDeviceApiService {
  constructor(private httpClient: HttpClient) {}

  healthCheck(): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(api);
  }

  getAllMqttServers(): Observable<MqttServer[]> {
    return this.httpClient.get<MqttServer[]>(`${api}/mqtt-servers`);
  }

  saveServer(server: MqttServer, serverId?: string): Observable<MqttServer> {
    return this.httpClient.put<MqttServer>(
      `${api}/mqtt-servers/${serverId || ''}`,
      server
    );
  }

  getMqttUsers(mqttServerId: string): Observable<MqttUser[]> {
    return this.httpClient.get<MqttUser[]>(
      `${api}/mqtt-servers/${mqttServerId}/mqtt-users`
    );
  }

  saveMqttUser(user: MqttUser, userId?: string): Observable<MqttUser> {
    return this.httpClient.put<MqttUser>(
      `${api}/mqtt-users/${userId || ''}`,
      user
    );
  }

  getMqttDevices(mqttUserId: string): Observable<MqttDevice[]> {
    return this.httpClient.get<MqttDevice[]>(
      `${api}/mqtt-users/${mqttUserId}/mqtt-devices`
    );
  }

  saveMqttDevice(
    device: MqttDevice,
    deviceId?: string
  ): Observable<MqttDevice> {
    return this.httpClient.put<MqttDevice>(
      `${api}/mqtt-devices/${deviceId || ''}`,
      device
    );
  }
}
