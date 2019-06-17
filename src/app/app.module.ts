import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MqttModule } from 'ngx-mqtt';

import { AppComponent } from './app.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LineChartModule } from './components/line-chart/line-chart.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MqttModule.forRoot({ connectOnCreate: false, path: '', protocol: 'wss' }),
    LineChartModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
