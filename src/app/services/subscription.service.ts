import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class SubscriptionService implements OnDestroy {
  private destroy$ = new Subject();

  constructor() {}

  takeUntilDestroyed<T>(obs$: Observable<T>): Observable<T> {
    return obs$.pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
