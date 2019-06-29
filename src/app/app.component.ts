import { MqttSettings } from './model/mqtt-settings';
import { Component, OnInit } from '@angular/core';
import { MqttService, MqttConnectionState } from 'ngx-mqtt';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombinedSensorData } from './model/combined-sensor-data';
import { toCelsius, getDepth } from './well-sensor/data-transformations';
import { Gut800Settings } from './model/gut800-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  samplesInFrame = 1000;

  subscription: Subscription;

  mqttState: MqttConnectionState;

  get isConnected(): boolean {
    return this.mqttState === MqttConnectionState.CONNECTED;
  }

  // deviceId = new FormControl('test', [Validators.required]);
  deviceId = new FormControl('Il/C', [Validators.required]);
  server = new FormControl('perfect-politician.cloudmqtt.com', [
    Validators.required
  ]);
  wssPort = new FormControl(443, [Validators.required]);
  user = new FormControl('gelphadi', [Validators.required]);
  mqttPwd = new FormControl('oYMgWJETz_0N', [Validators.required]);

  mqttSettingsForm = new FormGroup({
    deviceId: this.deviceId,
    server: this.server,
    wssPort: this.wssPort,
    user: this.user,
    mqttPwd: this.mqttPwd
  });

  get mqttSettingsErrors() {
    return Object.values(this.mqttSettingsForm.controls).filter(
      c => !!c.errors
    );
  }

  referenceDepth = new FormControl(7, [Validators.required]);
  minCurrent = new FormControl(4e-3, [Validators.required]);
  maxCurrent = new FormControl(20e-3, [Validators.required]);
  r = new FormControl(51, [Validators.required]);
  maxDepth = new FormControl(7, [Validators.required]);
  voltage = new FormControl(3.3, [Validators.required]);
  resolution = new FormControl(12, [Validators.required]);

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

  constructor(private mqtt: MqttService) {}

  ngOnInit() {
    this.mqtt.state.subscribe(s => {
      this.mqttState = s;
    });
    this.reconnect();
  }

  reconnect() {
    const mqtt = this.mqtt;

    const subscription = this.subscription;
    if (subscription) {
      subscription.unsubscribe();
    }

    this.disconnect();

    const v: MqttSettings = this.mqttSettingsForm.value;

    mqtt.connect({
      username: v.user,
      password: v.mqttPwd,
      servers: [{ host: v.server, port: v.wssPort }]
    });

    const deviceId = v.deviceId;

    this.subscription = mqtt.observe(`${deviceId}/Data`).subscribe(r => {
      const value: CombinedSensorData = JSON.parse(r.payload.toString()).value;
      const date = new Date();

      const data$ = this.data$;
      const series = data$.value.series;
      const newData = { date, ...value };

      data$.next({
        last: newData,
        series: [
          ...(series.length < this.samplesInFrame ? series : series.slice(1)),
          newData
        ]
      });
      this.latest$.next(newData);
    });

    this.resetChart();
  }

  openConfigurationDialog() {
    console.log('hello');
  }

  resetChart() {
    this.data$.next({ last: <CombinedSensorData>{}, series: [] });
  }

  applyGut800Settings() {
    this.gut800Settings = this.gut800SettingsForm.value;
    this.resetChart();
  }

  private disconnect() {
    if (this.mqttState === MqttConnectionState.CONNECTED) {
      this.mqtt.disconnect(true);
    }
  }

  private toDepth(arbUnits: number) {
    const settings = this.gut800Settings;
    return getDepth(
      arbUnits,
      settings.referenceDepth,
      settings.minCurrent,
      settings.maxCurrent,
      settings.r,
      settings.maxDepth,
      settings.voltage,
      settings.resolution
    );
  }
}
