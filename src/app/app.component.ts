import { Component, OnInit } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { GoogleChartPackagesHelper } from 'angular-google-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'well-sensor-filtering-ui';
  d = [];

  constructor(private mqtt: MqttService) {}

  ngOnInit() {
    const mqtt = this.mqtt;
    mqtt.connect({
      username: 'gelphadi',
      password: 'oYMgWJETz_0N',
      servers: [{ host: 'perfect-politician.cloudmqtt.com', port: 443 }]
    });

    mqtt.observe('Rostyk/Data').subscribe(r => {
      const value = JSON.parse(r.payload.toString()).value;
      this.d = [
        ...this.d,
        [new Date(), value.data, value.median, value.mean, value.expSmooth]
      ];
    });
  }
}
