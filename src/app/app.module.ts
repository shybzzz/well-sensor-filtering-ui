import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { LoadingTrackerModule } from './components/loading-tracker/loading-tracker.module';
import { MqttModule } from 'ngx-mqtt';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'mqtt-connections',
        loadChildren:
          './components/mqtt-connections/mqtt-connections.module#MqttConnectionsModule'
      },
      {
        path: 'mqtt-device',
        loadChildren:
          './components/mqtt-device/mqtt-device.module#MqttDeviceModule'
      }
    ]),
    MqttModule.forRoot({ connectOnCreate: false, path: '', protocol: 'wss' }),
    HttpClientModule,
    LoadingTrackerModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
