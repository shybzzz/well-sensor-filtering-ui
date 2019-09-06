import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorTypeToTextPipe } from './sensor-type-to-text.pipe';

@NgModule({
  declarations: [SensorTypeToTextPipe],
  imports: [CommonModule],
  exports: [SensorTypeToTextPipe]
})
export class SensorTypeToTextModule {}
