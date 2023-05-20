import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subscriber } from 'rxjs';

/** Wraps stream with zone */
export function enterZone<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) =>
        new Observable<T>((observer: Subscriber<T>) =>
            source.subscribe({
                next: (value: T) => zone.run(() => observer.next(value)),
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            })
        );
}
