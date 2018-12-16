import { Component, OnInit } from '@angular/core';
import { MqttService, MqttConnectionState } from 'ngx-mqtt';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string;
  d: any[] = [];
  samplesInFrame = 20;

  mqttState: MqttConnectionState;

  config = new FormControl('', (c: AbstractControl) => {
    try {
      JSON.parse(c.value);
      return null;
    } catch ({ message }) {
      return { invalidJSON: message };
    }
  });

  subscription: Subscription;

  formGroup = new FormGroup({
    config: this.config
  });

  constructor(private mqtt: MqttService) {}

  ngOnInit() {
    this.mqtt.state.subscribe(s => {
      this.mqttState = s;
    });
  }

  reconnect() {
    const mqtt = this.mqtt;

    const subscription = this.subscription;
    if (subscription) {
      subscription.unsubscribe();
    }

    this.disconnect();

    this.d = [];

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
    } = JSON.parse(this.config.value);
    const deviceId = v.deviceId;
    this.title = deviceId;
    mqtt.connect({
      username: v.user,
      password: v.mqttPwd,
      servers: [{ host: v.server, port: v.wssPort }]
    });

    this.subscription = mqtt.observe(`${deviceId}/Data`).subscribe(r => {
      const value = JSON.parse(r.payload.toString()).value;
      const d = this.d;
      this.d = [
        ...(d.length < this.samplesInFrame ? d : d.slice(1)),
        [new Date(), value.data, value.median, value.mean, value.expSmooth]
      ];
    });
  }

  private disconnect() {
    if (this.mqttState === MqttConnectionState.CONNECTED) {
      this.mqtt.disconnect(true);
    }
  }
}
