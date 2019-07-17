import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MqttModule } from 'ngx-mqtt';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MqttModule.forRoot({ connectOnCreate: false, path: '', protocol: 'wss' }),
    MaterialModule,
    NgxChartsModule,
    RouterModule.forRoot([
      {
        path: '',
        loadChildren:
          './components/mqtt-connections/mqtt-connections.module#MqttConnectionsModule'
      }
    ]),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
