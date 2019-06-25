import { Component, OnInit } from '@angular/core';
import { MqttService, MqttConnectionState } from 'ngx-mqtt';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
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
  title: string;
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

  rawData$ = new BehaviorSubject<{
    last: CombinedSensorData;
    series: CombinedSensorData[];
  }>({ last: <CombinedSensorData>{}, series: [] });

  temperatureName = 'Temperature, C';
  temperature$ = this.rawData$.pipe(
    map(data => [
      {
        name: `${this.temperatureName} ${toCelsius(data.last.temperature)} C`,
        series: data.series.map(sensorData => {
          return {
            name: sensorData.date,
            value: toCelsius(sensorData.temperature)
          };
        })
      }
    ])
  );

  depthName = 'Depth, m';

  depth$ = this.rawData$.pipe(
    map(data => [
      {
        name: `${this.depthName} ${this.toDepth(data.last.depth)} m`,
        series: data.series.map(sensorData => {
          return {
            name: sensorData.date,
            value: this.toDepth(sensorData.depth)
          };
        })
      }
    ])
  );

  solarPowerName = 'Solar Power';
  solarPower$ = this.rawData$.pipe(
    map(data => [
      {
        name: `${this.solarPowerName} ${data.last.solarCurrent}`,
        series: data.series.map(sensorData => {
          return { name: sensorData.date, value: sensorData.solarCurrent };
        })
      }
    ])
  );

  consumptionName = 'Consumption';
  consumption$ = this.rawData$.pipe(
    map(data => [
      {
        name: `${this.consumptionName} ${data.last.consumption}`,
        series: data.series.map(sensorData => {
          return { name: sensorData.date, value: sensorData.consumption };
        })
      }
    ])
  );

  dischargeName = 'Discharge';
  discharge$ = this.rawData$.pipe(
    map(data => [
      {
        name: `${this.dischargeName} ${data.last.discharge}`,
        series: data.series.map(sensorData => {
          return { name: sensorData.date, value: sensorData.discharge };
        })
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

    const v: {
      deviceId: string;
      apSSID: string;
      apIP: string;
      appPwd: string;
      server: string;
      port: number;
      wssPort?: number;
      user: string;
      mqttPwd: string;
    } = this.mqttSettingsForm.value;
    const deviceId = v.deviceId;
    this.title = deviceId;
    mqtt.connect({
      username: v.user,
      password: v.mqttPwd,
      servers: [{ host: v.server, port: v.wssPort }]
    });

    this.subscription = mqtt.observe(`${deviceId}/Data`).subscribe(r => {
      const value: CombinedSensorData = JSON.parse(r.payload.toString()).value;
      const date = new Date();

      const data$ = this.rawData$;
      const series = data$.value.series;
      const newData = { date, ...value };

      data$.next({
        last: newData,
        series: [
          ...(series.length < this.samplesInFrame ? series : series.slice(1)),
          newData
        ]
      });
    });

    this.resetChart();
  }

  openConfigurationDialog() {
    console.log('hello');
  }

  resetChart() {
    this.rawData$.next({ last: <CombinedSensorData>{}, series: [] });
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
