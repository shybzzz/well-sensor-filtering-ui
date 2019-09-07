import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MqttDeviceComponent } from './mqtt-device.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { LoadingTrackerModule } from '../loading-tracker/loading-tracker.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SensorTypeToTextModule } from 'src/app/pipes/sensor-type-to-text/sensor-type-to-text.module';
import { MqttDeviceSettingsDialogComponent } from './dialogs/mqtt-device-settings-dialog/mqtt-device-settings-dialog.component';

@NgModule({
  declarations: [MqttDeviceComponent, MqttDeviceSettingsDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MqttDeviceComponent }]),
    MaterialModule,
    LoadingTrackerModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
    FlexLayoutModule,
    SensorTypeToTextModule
  ],
  entryComponents: [MqttDeviceComponent, MqttDeviceSettingsDialogComponent]
})
export class MqttDeviceModule {}
