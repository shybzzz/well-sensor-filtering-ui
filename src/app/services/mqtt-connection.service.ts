import { MqttUser } from './../model/mqtt-user';
import { MqttDeviceApiService } from 'src/app/api/mqtt-device-api.service';
import { Injectable } from '@angular/core';
import { ReplaySubject, combineLatest, Subject } from 'rxjs';
import { MqttServer } from '../model/mqtt-server';
import { map, withLatestFrom, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MqttConnectionService {
  resetMqttServers$ = new Subject();
  resetMqttUsers$ = new Subject();

  mqttServers$ = new ReplaySubject<MqttServer[]>(1);
  mqttUsers$ = new ReplaySubject<MqttUser[]>(1);

  currentMqttServerId$ = new ReplaySubject<string>(1);
  currentMqttUserId$ = new ReplaySubject<string>(1);

  getMqttServers$ = this.resetMqttServers$.pipe(
    map(() =>
      this.mqttDeviceApiService
        .getAllMqttServers()
        .pipe(tap(mqttServers => this.mqttServers$.next(mqttServers)))
    )
  );

  currentMqttServer$ = this.currentMqttServerId$.pipe(
    withLatestFrom(this.mqttServers$),
    map(([mqttServerId, mqttServers]) =>
      mqttServers.find(mqttServer => mqttServer.id === mqttServerId)
    )
  );

  getMqttUsers$ = this.resetMqttUsers$.pipe(
    withLatestFrom(
      this.currentMqttServer$.pipe(filter(mqttServer => !!mqttServer))
    ),
    map(([, mqttServer]) =>
      this.mqttDeviceApiService
        .getMqttUsers(mqttServer.id)
        .pipe(tap(mqttUsers => this.mqttUsers$.next(mqttUsers)))
    )
  );

  currentMqttUser$ = this.currentMqttUserId$.pipe(
    withLatestFrom(this.mqttUsers$),
    map(([mqttUserId, mqttUsers]) =>
      mqttUsers.find(mqttUser => mqttUser.id === mqttUserId)
    )
  );

  constructor(private mqttDeviceApiService: MqttDeviceApiService) {}
}
