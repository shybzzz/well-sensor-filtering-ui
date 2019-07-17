import { Injectable } from '@angular/core';
import { ReplaySubject, combineLatest } from 'rxjs';
import { MqttServer } from '../model/mqtt-server';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MqttConnectionService {
  mqttServers$ = new ReplaySubject<MqttServer[]>(1);
  currentMqttServerId$ = new ReplaySubject<string>(1);

  currentMqttServer$ = combineLatest([
    this.currentMqttServerId$,
    this.mqttServers$
  ]).pipe(
    map(([mqttServerId, mqttServers]) =>
      mqttServers.find(mqttServer => mqttServer.id === mqttServerId)
    )
  );

  constructor() {}
}
