import { LoadingService } from './../../services/loading.service';
import { LocalStorageService } from './../../services/local-storage.service';
import { MqttConnectionService } from './../../services/mqtt-connection.service';
import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { MqttDeviceApiService } from 'src/app/api/mqtt-device-api.service';
import {
  FormControl,
  Validators,
  FormGroup,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-mqtt-connections',
  templateUrl: './mqtt-connections.component.html',
  styleUrls: ['./mqtt-connections.component.scss'],
  providers: [SubscriptionService, LoadingService]
})
export class MqttConnectionsComponent implements OnInit {
  server = new FormControl(null, [Validators.required]);
  wssPort = new FormControl(null, [Validators.required]);

  mqttServerForm = new FormGroup({
    server: this.server,
    wssPort: this.wssPort
  });

  get mqttServerErrors() {
    return Object.values(this.mqttServerForm.controls).filter(c => !!c.errors);
  }

  user = new FormControl(null, [Validators.required]);
  mqttPassword = new FormControl(null, [Validators.required]);

  mqttUserForm = new FormGroup({
    user: this.user,
    mqttPassword: this.mqttPassword
  });

  get mqttUserErrors() {
    return Object.values(this.mqttUserForm.controls).filter(c => !!c.errors);
  }

  matcher = new MyErrorStateMatcher();

  currentMqttServerId: string;
  currentMqttUserId: string;

  constructor(
    public mqttConnectionService: MqttConnectionService,
    private mqttDeviceApiService: MqttDeviceApiService,
    private localStorageSevice: LocalStorageService,
    private subscriptionService: SubscriptionService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    const subscriptionService = this.subscriptionService;
    const mqttConnectionService = this.mqttConnectionService;

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.currentMqttServer$)
      .subscribe(mqttServer => {
        this.mqttServerForm.reset(mqttServer || {});
      });

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.currentMqttServerId$)
      .subscribe(id => {
        this.localStorageSevice.setCurrentMqttServerId(id);
        this.currentMqttServerId = id;
      });

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.currentMqttUser$)
      .subscribe(mqttUser => {
        this.mqttUserForm.reset(mqttUser || {});
      });

    subscriptionService
      .takeUntilDestroyed(mqttConnectionService.currentMqttUserId$)
      .subscribe(id => {
        this.localStorageSevice.setCurrentMqttUserId(id);
        this.currentMqttUserId = id;
      });
  }

  selectMqttServer(mqttServerId: string) {
    this.mqttConnectionService.currentMqttServerId$.next(mqttServerId);
  }

  saveMqttServer() {
    this.loadingService
      .track(
        this.mqttDeviceApiService.saveServer(
          this.mqttServerForm.value,
          this.currentMqttServerId
        )
      )
      .subscribe(r => {
        this.localStorageSevice.setCurrentMqttServerId(r.id);
        this.mqttConnectionService.resetMqttServers$.next();
      });
  }

  selectMqttUser(mqttUserId: string) {
    this.mqttConnectionService.currentMqttUserId$.next(mqttUserId);
  }

  saveMqttUser() {
    const mqttServerId = this.currentMqttServerId;
    this.loadingService
      .track(
        this.mqttDeviceApiService.saveMqttUser(
          { mqttServerId, ...this.mqttUserForm.value },
          this.currentMqttUserId
        )
      )
      .subscribe(r => {
        this.localStorageSevice.setCurrentMqttUserId(r.id);
        this.mqttConnectionService.resetMqttUsers$.next();
      });
  }
}
