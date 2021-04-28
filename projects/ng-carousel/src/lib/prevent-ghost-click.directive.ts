import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { asyncScheduler } from 'rxjs';

import { HammerProviderService } from './private/service/hammer-provider.service';

@Directive({
    selector: '[ngCarouselPreventGhostClick]',
})
export class PreventGhostClickDirective implements OnInit, OnDestroy {

    private hammerManager: HammerManager | null = null;
    private shouldPreventClick = false;
    private readonly boundPreventFn = this.preventEvent.bind(this);

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private hammer: HammerProviderService,
    ) {
    }

    ngOnInit() {
        this.listenClickCaptureEvents();
        this.listenPanEndEvents();
    }

    ngOnDestroy() {
        if (this.hammerManager) {
            this.hammerManager.destroy();
        }
        this.elementRef.nativeElement.removeEventListener('click', this.boundPreventFn, {capture: true});
    }

    private listenClickCaptureEvents(): void {
        this.elementRef.nativeElement.addEventListener('click', this.boundPreventFn, {capture: true});
    }

    private listenPanEndEvents(): void {
        this.hammerManager = this.hammer.managerFor(this.elementRef.nativeElement);
        if (!this.hammerManager) {

            return;
        }
        this.hammerManager.on('panend pancancel', () => {
            this.shouldPreventClick = true;
            asyncScheduler.schedule(() => {
                this.shouldPreventClick = false;
            });
        });
    }

    private preventEvent(event: MouseEvent): void {
        if (this.shouldPreventClick) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }


}
