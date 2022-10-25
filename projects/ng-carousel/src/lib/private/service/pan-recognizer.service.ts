import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone, Optional, RendererFactory2 } from '@angular/core';
import { asyncScheduler, Observable, Subscription } from 'rxjs';

import { CarouselService } from './carousel.service';

const listenerOptions = {passive: true, capture: true};
const captureOptions = {capture: true};

@Injectable()
export class PanRecognizerService<T> {

    // Be advised that pan does not start when user presses the pointer,
    // it should move by a certain threshold first before recognizing
    // as a pan gesture. Otherwise, it is just a click.

    /**
     * Tells for the whole chain (pointer events -> click events),
     * that pan is still ongoing (even after pointer is up),
     * so we can prevent ghost clicks
     */
    isPanning = false;
    /**
     * Immediately responds to pan event status (is ongoing or not)
     */
    private isPanningSync = false;
    /** X and Y of pointer when user pressed it */
    private startCoordinates: [number, number] | null = null;
    private lastX: number | null = null;
    private schedule$: Subscription | null = null;

    private readonly renderer = this.rendererFactory.createRenderer(null, null);

    constructor(
        private zone: NgZone,
        private rendererFactory: RendererFactory2,
        @Optional() private carousel: CarouselService<T> | null,
        @Inject(DOCUMENT) private document: Document,
    ) {
    }

    /** Submits drag event to carousel service whenever one happens */
    listen(element: HTMLElement): Observable<void> {
        const listeners = [
            [element, 'pointerdown', this.startDrag.bind(this), listenerOptions] as const,
            [this.document, 'pointermove', this.processDrag.bind(this, element), captureOptions] as const,
            [this.document, 'pointerup', this.endDrag.bind(this, element), captureOptions] as const,
            [this.document, 'pointercancel', this.endDrag.bind(this, element), captureOptions] as const,
        ];

        return new Observable(() => {
            listeners.forEach(([el, name, fn, options]) => {
                this.zone.runOutsideAngular(() => {
                    el.addEventListener(name, fn as () => void, options);
                });
            });

            return () => {
                listeners.forEach(([el, name, fn, options]) => {
                    el.removeEventListener(name, fn as () => void, options);
                });
            };
        });
    }

    private reset(): void {
        this.startCoordinates = null;
        this.lastX = null;
        this.isPanningSync = false;
        this.schedule$ = asyncScheduler.schedule(() => {
            this.isPanning = false;
            this.schedule$ = null;
        });
    }

    private startDrag(event: PointerEvent): void {
        this.reset();
        this.startCoordinates = [event.pageX, event.pageY];
    }

    private processDrag(element: HTMLElement, event: PointerEvent): void {
        if (this.startCoordinates === null) {

            return;
        }
        const eventCoordinates = [event.pageX, event.pageY];
        if (!eventCoordinates) {

            return;
        }

        event.preventDefault();

        if (this.isPanningSync) {
            this.carousel?.drag(this.lastX || 0, Math.round(eventCoordinates[0]));
            this.lastX = Math.round(eventCoordinates[0]);

            return;
        }

        const deltaX = Math.abs(eventCoordinates[0] - this.startCoordinates[0]);
        const deltaY = Math.abs(eventCoordinates[1] - this.startCoordinates[1]);
        if (deltaX < 10 && deltaY < 10) {

            return;
        }
        if (deltaX < deltaY) {
            this.reset();

            return;
        }
        this.carousel?.dragStart();
        // We should block all scroll attempts during current pan session
        this.renderer.setStyle(element, 'touch-action', 'none');
        this.isPanningSync = true;
        this.isPanning = true;
        this.schedule$?.unsubscribe();
        this.lastX = Math.round(eventCoordinates[0]);
    }

    private endDrag(element: HTMLElement, event: PointerEvent): void {
        if (this.startCoordinates === null) {

            return;
        }
        const eventCoordinates = [event.pageX, event.pageY];
        const x = eventCoordinates?.[0] ?? this.lastX ?? null;
        const startX = this.startCoordinates[0];
        this.reset();
        if (x === null) {

            return;
        }
        event.preventDefault();
        this.carousel?.dragEnd(Math.round(x - startX));
        this.renderer.removeStyle(element, 'touch-action');
    }

}
