import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { asyncScheduler } from 'rxjs';

import { HammerProviderService } from './private/service/hammer-provider.service';

@Directive({
    selector: '[ngCarouselPreventGhostClick]',
})
export class PreventGhostClickDirective implements OnInit, OnDestroy {

    private hammerManager: HammerManager | null = null;
    private shouldPreventClick = false;

    @HostListener('click', ['$event'])
    private processClickEvent(event: Event): void {
        if (this.shouldPreventClick) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    constructor(
        private elementRef: ElementRef,
        private hammer: HammerProviderService,
    ) {
    }

    ngOnInit() {
        this.listenPanEndEvents();
    }

    ngOnDestroy() {
        if (this.hammerManager) {
            this.hammerManager.destroy();
        }
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

}
