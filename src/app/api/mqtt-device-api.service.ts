import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MqttServer } from '../model/mqtt-server';

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
      server,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
