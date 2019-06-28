import { Component, OnInit, Input } from '@angular/core';

const scheme = ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'];

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() data: [{ name: string; series: [{ name: Date; value: number }] }];
  @Input() name: string;
  @Input() latest: [{ name: Date; value: number }];
  @Input() min = 0;
  @Input() max = 4095;
  @Input() units = 'arb. units';

  get yAxisLabel() {
    return `${this.name}, ${this.units}`;
  }

  constructor() {}

  ngOnInit() {}
}
