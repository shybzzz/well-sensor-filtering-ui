import { LoadingService } from './../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-loading-tracker',
  templateUrl: './loading-tracker.component.html',
  styleUrls: ['./loading-tracker.component.scss'],
  providers: [SubscriptionService]
})
export class LoadingTrackerComponent implements OnInit {
  constructor(public loadingService: LoadingService) {}

  ngOnInit() {}
}
