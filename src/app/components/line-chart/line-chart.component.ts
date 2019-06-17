import { Component, OnInit, Input } from '@angular/core';


const scheme = ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'];

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input() data: [{ name: string, series: [{ name: Date, value: number }] }];
  @Input() name: string;

  colorScheme = {
    domain: [scheme[Math.round(Math.random() * scheme.length - 1)]]
  };


  constructor() { }

  ngOnInit() {
  }

}
