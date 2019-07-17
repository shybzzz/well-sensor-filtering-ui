import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private runningRequests$ = new BehaviorSubject<number>(0);
  isRunning$ = this.runningRequests$.pipe(map(n => n > 0));
  errorOccured$ = new Subject<{ message; name }>();

  constructor(private subscriptionService: SubscriptionService) {}

  track<T>(obs: Observable<T>): Observable<T> {
    this.errorOccured$.next(null);
    this.runningRequests$.next(this.runningRequests$.value + 1);
    return this.subscriptionService.takeUntilDestroyed(obs).pipe(
      tap(arg => {
        this.reduceRequests();
        return arg;
      }),
      catchError(err => {
        this.reduceRequests();
        this.errorOccured$.next(err);
        return throwError(err);
      })
    );
  }

  private reduceRequests() {
    this.runningRequests$.next(this.runningRequests$.value - 1);
  }
}
