import { Component, OnInit } from '@angular/core';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'well-sensor-filtering-ui';
  d = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000]
  ];

  constructor(private mqtt: MqttService) {}

  ngOnInit() {
    const mqtt = this.mqtt;
    mqtt.connect({
      username: 'gelphadi',
      password: 'oYMgWJETz_0N',
      servers: [{ host: 'perfect-politician.cloudmqtt.com', port: 443 }]
    });

    mqtt.observe('Rostyk/Data').subscribe(r => console.log(r));
  }
}
