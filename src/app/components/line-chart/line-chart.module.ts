import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule, NgxChartsModule
  ],
  declarations: [LineChartComponent],
  exports: [LineChartComponent]
})
export class LineChartModule { }
