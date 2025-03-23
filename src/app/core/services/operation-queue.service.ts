import { Injectable } from '@angular/core';
import { concatMap, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationQueueService {
  private taskQueue = new Subject<() => Observable<any>>();

  constructor() {
    this.taskQueue.pipe(concatMap((task) => task())).subscribe({
      error: (err) => console.error('Queue error:', err),
    });
  }

  addTask(task: () => Observable<any>) {
    this.taskQueue.next(task);
  }
}
