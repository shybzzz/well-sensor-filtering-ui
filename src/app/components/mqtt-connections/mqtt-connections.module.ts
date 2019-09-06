import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MqttConnectionsComponent } from './mqtt-connections.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingTrackerModule } from '../loading-tracker/loading-tracker.module';
import { SensorTypeToTextModule } from 'src/app/pipes/sensor-type-to-text/sensor-type-to-text.module';

@NgModule({
  declarations: [MqttConnectionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MqttConnectionsComponent }]),
    MaterialModule,
    LoadingTrackerModule,
    ReactiveFormsModule,
    SensorTypeToTextModule
  ]
})
export class MqttConnectionsModule {}
