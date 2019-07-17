import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingTrackerComponent } from './loading-tracker.component';

@NgModule({
  declarations: [LoadingTrackerComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LoadingTrackerComponent]
})
export class LoadingTrackerModule {}
