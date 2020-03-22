import { MqttDevice } from './../../model/mqtt-device';
import { MqttDeviceSettingsDialogComponent } from './dialogs/mqtt-device-settings-dialog/mqtt-device-settings-dialog.component';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { MqttConnectionService } from './../../services/mqtt-connection.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { Subscription, BehaviorSubject, Subject, merge } from 'rxjs';
import { CombinedSensorData } from 'src/app/model/combined-sensor-data';
import { map, debounceTime } from 'rxjs/operators';
import {
  toCelsius,
  getDepth,
  toMeters
} from 'src/app/well-sensor/data-transformations';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Gut800Settings } from 'src/app/model/gut800-settings';
import { MqttService, MqttConnectionState } from 'ngx-mqtt';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mqtt-device',
  templateUrl: './mqtt-device.component.html',
  styleUrls: ['./mqtt-device.component.scss'],
  providers: [LoadingService, SubscriptionService]
})
export class MqttDeviceComponent implements OnInit, OnDestroy {
  mqttSubscription: Subscription;
  samplesInFrame = 1000;
  temperatureName = 'Temperature';
  depthName = 'Depth';
  solarPowerName = 'Solar Power';
  consumptionName = 'Consumption';
  dischargeName = 'Discharge';

  data$ = new BehaviorSubject<{
    last: CombinedSensorData;
    series: CombinedSensorData[];
  }>({ last: <CombinedSensorData>{}, series: [] });

  temperature$ = this.data$.pipe(
    map(data => [
      {
        name: `${this.temperatureName}`,
        series: data.series.map(sensorData => {
          return {
            name: sensorData.date,
            value: toCelsius(sensorData.temperature)
          };
        })
      }
    ])
  );

  depth$ = this.data$.pipe(
    map(data => [
      {
        name: `${this.depthName}`,
        series: data.series.map(sensorData => {
          return {
            name: sensorData.date,
            value: this.toDepth(sensorData.depth)
          };
        })
      }
    ])
  );

  solarPower$ = this.data$.pipe(
    map(data => [
      {
        name: `${this.solarPowerName}`,
        series: data.series.map(sensorData => {
          return { name: sensorData.date, value: sensorData.solarCurrent };
        })
      }
    ])
  );

  consumption$ = this.data$.pipe(
    map(data => [
      {
        name: `${this.consumptionName}`,
        series: data.series.map(sensorData => {
          return { name: sensorData.date, value: sensorData.consumption };
        })
      }
    ])
  );

  discharge$ = this.data$.pipe(
    map(data => [
      {
        name: `${this.dischargeName}`,
        series: data.series.map(sensorData => {
          return { name: sensorData.date, value: sensorData.discharge };
        })
      }
    ])
  );

  latest$ = new Subject<CombinedSensorData>();

  latestTemperature$ = this.latest$.pipe(
    map(latest => [
      {
        name: this.temperatureName,
        value: toCelsius(latest.temperature)
      }
    ])
  );

  latestDepth$ = this.latest$.pipe(
    map(latest => [
      {
        name: this.depthName,
        value: this.toDepth(latest.depth)
      }
    ])
  );

  latestSolarPower$ = this.latest$.pipe(
    map(latest => [
      {
        name: this.solarPowerName,
        value: latest.solarCurrent
      }
    ])
  );

  latestConsuption$ = this.latest$.pipe(
    map(latest => [
      {
        name: this.consumptionName,
        value: latest.consumption
      }
    ])
  );

  latestDischarge$ = this.latest$.pipe(
    map(latest => [
      {
        name: this.dischargeName,
        value: latest.discharge
      }
    ])
  );

  referenceDepth = new FormControl(5.2, [Validators.required]);
  minCurrent = new FormControl(4e-3, [Validators.required]);
  maxCurrent = new FormControl(20e-3, [Validators.required]);
  r = new FormControl(44, [Validators.required]);
  maxDepth = new FormControl(7, [Validators.required]);
  voltage = new FormControl(1, [Validators.required]);
  resolution = new FormControl(10, [Validators.required]);

  gut800SettingsForm = new FormGroup({
    referenceDepth: this.referenceDepth,
    minCurrent: this.minCurrent,
    maxCurrent: this.maxCurrent,
    r: this.r,
    maxDepth: this.maxDepth,
    voltage: this.voltage,
    resolution: this.resolution
  });

  get gut800SettingsErrors() {
    return Object.values(this.gut800SettingsForm.controls).filter(
      c => !!c.errors
    );
  }

  gut800Settings: Gut800Settings = this.gut800SettingsForm.value;

  deviceWorking$ = this.data$.pipe(map(data => !!data.series.length));

  deviceStopped$ = this.data$.pipe(
    debounceTime(5000),
    map(() => false)
  );

  deviceState$ = merge(this.deviceWorking$, this.deviceStopped$);

  mqttDevice: MqttDevice;

  constructor(
    public mqttConnectionService: MqttConnectionService,
    private mqttService: MqttService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const mqttConnectionService = this.mqttConnectionService;
    const subscriptionService = this.subscriptionService;
    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.observeMqttData$)
      .subscribe(observeMqttData$ => {
        this.unsubscribe();

        this.mqttSubscription = observeMqttData$.subscribe(mqttMessage => {
          const value: CombinedSensorData = JSON.parse(
            mqttMessage.payload.toString()
          ).value;
          const date = new Date();

          const data$ = this.data$;
          const series = data$.value.series;
          const newData = { date, ...value };

          data$.next({
            last: newData,
            series: [
              ...(series.length < this.samplesInFrame
                ? series
                : series.slice(1)),
              newData
            ]
          });
          this.latest$.next(newData);
        });
      });

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.mqttSettings$)
      .subscribe(() => {
        mqttConnectionService.resetMqttConnection$.next();
      });

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.currentMqttDevice$)
      .subscribe(mqttDevice => {
        this.mqttDevice = mqttDevice;
      });
  }

  resetChart() {
    this.data$.next({ last: <CombinedSensorData>{}, series: [] });
  }

  applyGut800Settings() {
    this.gut800Settings = this.gut800SettingsForm.value;
    this.resetChart();
  }

  openMqttDeviceSettingsDialog(): void {
    const dialogRef = this.dialog.open(MqttDeviceSettingsDialogComponent);
    const mqttService = this.mqttService;
    dialogRef.afterClosed().subscribe(result => {
      const mqttDevice = this.mqttDevice;
      if (mqttDevice) {
        this.subscriptionService
          .takeUntilDestroyed(
            mqttService.publish(
              `${mqttDevice.deviceName}/Config`,
              JSON.stringify(result)
            )
          )
          .subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
    const mqttService = this.mqttService;
    if (mqttService.state.value === MqttConnectionState.CONNECTED) {
      mqttService.disconnect();
    }
  }

  private toDepth(arbUnits: number) {
    const settings = this.gut800Settings;
    return toMeters(
      arbUnits,
      settings.minCurrent,
      settings.maxCurrent,
      settings.r,
      settings.maxDepth,
      settings.voltage,
      settings.resolution
    );
  }

  private unsubscribe() {
    const subscription = this.mqttSubscription;
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
