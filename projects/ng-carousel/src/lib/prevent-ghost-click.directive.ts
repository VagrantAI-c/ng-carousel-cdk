import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { PanRecognizerService } from './private/service/pan-recognizer.service';

@Directive({
    selector: '[ngCarouselPreventGhostClick]',
})
export class PreventGhostClickDirective implements OnInit, OnDestroy {

    private preventFn = this.preventEvent.bind(this);
    private readonly opts = {capture: true};
    private readonly element = this.elementRef.nativeElement;

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private panRecognizer: PanRecognizerService<any>,
    ) {
    }

    ngOnInit() {
        this.element.addEventListener('click', this.preventFn, this.opts);
    }

    ngOnDestroy() {
        this.element.removeEventListener('click', this.preventFn, this.opts);
    }

    private preventEvent(event: MouseEvent | TouchEvent): void {
        if (this.panRecognizer.isPanning) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }


}
