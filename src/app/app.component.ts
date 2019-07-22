import { LoadingService } from './services/loading.service';
import { LocalStorageService } from './services/local-storage.service';
import { MqttConnectionService } from './services/mqtt-connection.service';
import { Component, OnInit } from '@angular/core';
import { MqttDeviceApiService } from './api/mqtt-device-api.service';
import { SubscriptionService } from './services/subscription.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SubscriptionService, LoadingService]
})
export class AppComponent implements OnInit {
  healthCheck: string;

  constructor(
    private mqttDeviceApiService: MqttDeviceApiService,
    private mqttConnectionService: MqttConnectionService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private loadingService: LoadingService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.loadingService
      .track(this.mqttDeviceApiService.healthCheck())
      .subscribe(response => {
        this.healthCheck = response.message;
      });

    const mqttConnectionService = this.mqttConnectionService;
    const subscriptionService = this.subscriptionService;

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.getMqttServers$)
      .subscribe(getMqttServers$ =>
        this.loadingService
          .track(getMqttServers$)
          .subscribe(() =>
            mqttConnectionService.currentMqttServerId$.next(
              this.localStorageService.getCurrentMqttServerId()
            )
          )
      );

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.getMqttUsers$)
      .subscribe(getMqttUsers$ =>
        this.loadingService
          .track(getMqttUsers$)
          .subscribe(() =>
            mqttConnectionService.currentMqttUserId$.next(
              this.localStorageService.getCurrentMqttUserId()
            )
          )
      );

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.currentMqttServer$)
      .subscribe(() => {
        mqttConnectionService.resetMqttUsers$.next();
      });

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.getMqttDevices$)
      .subscribe(getMqttDevices$ =>
        this.loadingService
          .track(getMqttDevices$)
          .subscribe(() =>
            mqttConnectionService.currentMqttDeviceId$.next(
              this.localStorageService.getCurrentMqttDeviceId()
            )
          )
      );

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.currentMqttUser$)
      .subscribe(() => {
        mqttConnectionService.resetMqttDevices$.next();
      });

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.mqttSettings$.pipe(take(1)))
      .subscribe(() => {
        this.router.navigate(['/mqtt-device']);
      });

    subscriptionService
      .takeUntilDestroyed(
        mqttConnectionService.mqttSettingsNotReady$.pipe(take(1))
      )
      .subscribe(() => {
        this.router.navigate(['/mqtt-connections']);
      });

    mqttConnectionService.resetMqttServers$.next();
  }
}
