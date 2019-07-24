import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MqttDeviceComponent } from './mqtt-device.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { LoadingTrackerModule } from '../loading-tracker/loading-tracker.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [MqttDeviceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MqttDeviceComponent }]),
    MaterialModule,
    LoadingTrackerModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
    FlexLayoutModule
  ]
})
export class MqttDeviceModule {}
