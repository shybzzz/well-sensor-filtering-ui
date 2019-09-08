import { InvalidUntouchedMatcher } from './../../../../helpers/invalid-untouched-matcher';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mqtt-device-settings-dialog',
  templateUrl: './mqtt-device-settings-dialog.component.html',
  styleUrls: ['./mqtt-device-settings-dialog.component.scss']
})
export class MqttDeviceSettingsDialogComponent implements OnInit {
  minimumDealay = 500; // ms
  delay = new FormControl(500, [Validators.required, Validators.min(500)]);
  formGroup = new FormGroup({ delay: this.delay });

  matcher = new InvalidUntouchedMatcher();

  constructor() {}

  ngOnInit() {}
}
