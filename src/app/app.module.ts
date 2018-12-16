import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { MqttModule } from 'ngx-mqtt';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    GoogleChartsModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    MqttModule.forRoot({ connectOnCreate: false, path: '', protocol: 'wss' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
