import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MqttConnectionsComponent } from './mqtt-connections.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingTrackerModule } from '../loading-tracker/loading-tracker.module';

@NgModule({
  declarations: [MqttConnectionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MqttConnectionsComponent }]),
    MaterialModule,
    LoadingTrackerModule,
    ReactiveFormsModule
  ]
})
export class MqttConnectionsModule {}
