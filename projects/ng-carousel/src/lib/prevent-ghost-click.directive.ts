import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, Optional, RendererFactory2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { PanRecognizerService } from './private/service/pan-recognizer.service';

@Directive({
    selector: '[ngCarouselPreventGhostClick]',
})
export class PreventGhostClickDirective implements OnInit, OnDestroy {

    @Input('ngCarouselPreventGhostClick') parentElement?: HTMLElement | '' | null = null;

    private preventFn = this.preventEvent.bind(this);
    private readonly opts = {capture: true};
    private readonly element = this.elementRef.nativeElement;
    private readonly requiredPanRecognizer = this.panRecognizer
        || new PanRecognizerService(this.zone, this.rendererFactory, null, this.document);
    private readonly subscriptions$ = new Subscription();

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private zone: NgZone,
        private rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document: Document,
        @Optional() private panRecognizer: PanRecognizerService<any>,
    ) {
    }

    ngOnInit() {
        this.element.addEventListener('click', this.preventFn, this.opts);
        if (!this.panRecognizer) {
            const subscription$ = this.requiredPanRecognizer.listen(this.parentElement || this.elementRef.nativeElement).subscribe();
            this.subscriptions$.add(subscription$);
        }
    }

    ngOnDestroy() {
        this.element.removeEventListener('click', this.preventFn, this.opts);
        this.subscriptions$.unsubscribe();
    }

    private preventEvent(event: MouseEvent | TouchEvent): void {
        if (this.requiredPanRecognizer?.isPanning) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }


}
