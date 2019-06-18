import { Component, OnInit } from '@angular/core';
import { MqttService, MqttConnectionState } from 'ngx-mqtt';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombinedSensorData } from './model/combined-sensor-data';

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
    return this.mqttState == MqttConnectionState.CONNECTED;
  }

  // config = new FormControl(
  //   // tslint:disable-next-line:max-line-length
  //   '{"deviceId":"Il/C","apSSID":"Well Sensor","apIP":"192.168.4.1","appPwd":"11111111","server":"perfect-politician.cloudmqtt.com","port":1883,"wssPort":443,"user":"gelphadi","mqttPwd":"oYMgWJETz_0N"}',
  //   (c: AbstractControl) => {
  //     try {
  //       JSON.parse(c.value);
  //       return null;
  //     } catch ({ message }) {
  //       return { invalidJSON: message };
  //     }
  //   }
  // );

  deviceId = new FormControl(
    'Il/C', [Validators.required]
  );

  server = new FormControl(
    'perfect-politician.cloudmqtt.com', [Validators.required]
  );

  wssPort = new FormControl(
    443, [Validators.required]
  );

  user = new FormControl(
    'gelphadi', [Validators.required]
  );

  mqttPwd = new FormControl(
    'oYMgWJETz_0N', [Validators.required]
  );

  formGroup = new FormGroup({
    // config: this.config
    deviceId: this.deviceId,
    server: this.server,
    wssPort: this.wssPort,
    user: this.user,
    mqttPwd: this.mqttPwd
  });

  get errors() {
    return Object.values(this.formGroup.controls).filter(c => !!c.errors);
  }

  rawData$ = new BehaviorSubject<{ last: CombinedSensorData, series: CombinedSensorData[] }>({ last: <CombinedSensorData>{}, series: [] });

  temperatureName = 'Temperature';
  temperature$ = this.rawData$.pipe(map(data =>
    [{
      name: `${this.temperatureName} ${data.last.temperature / 100} C`, series: data.series.map(sensorData => {
        return { name: sensorData.date, value: sensorData.temperature / 100 };
      })
    }]
  ));

  depthName = 'Depth';
  depth$ = this.rawData$.pipe(map(data =>
    [{
      name: `${this.depthName} ${data.last.depth}`, series: data.series.map(sensorData => {
        return { name: sensorData.date, value: sensorData.depth };
      })
    }]
  ));

  solarPowerName = 'Solar Power';
  solarPower$ = this.rawData$.pipe(map(data =>
    [{
      name: `${this.solarPowerName} ${data.last.solarCurrent}`, series: data.series.map(sensorData => {
        return { name: sensorData.date, value: sensorData.solarCurrent };
      })
    }]
  ));

  consumptionName = 'Consumption';
  consumption$ = this.rawData$.pipe(map(data =>
    [{
      name: `${this.consumptionName} ${data.last.consumption}`, series: data.series.map(sensorData => {
        return { name: sensorData.date, value: sensorData.consumption };
      })
    }]
  ));

  dischargeName = 'Discharge';
  discharge$ = this.rawData$.pipe(map(data =>
    [{
      name: `${this.dischargeName} ${data.last.discharge}`, series: data.series.map(sensorData => {
        return { name: sensorData.date, value: sensorData.discharge };
      })
    }]
  ));

  constructor(private mqtt: MqttService) { }

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
    } = this.formGroup.value;
    // JSON.parse(this.config.value);
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
        last: newData, series: [
          ...(series.length < this.samplesInFrame
            ? series
            : series.slice(1)),
          newData
        ]
      });

    });
  }

  private disconnect() {
    if (this.mqttState === MqttConnectionState.CONNECTED) {
      this.mqtt.disconnect(true);
    }
  }

  openConfigurationDialog() {
    console.log("hello")
  }
}
