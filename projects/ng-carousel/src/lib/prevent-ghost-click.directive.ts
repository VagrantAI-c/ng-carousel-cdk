import { Directive, ElementRef, Inject, PLATFORM_ID, isDevMode, OnInit, OnDestroy } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';
import { isPlatformBrowser } from '@angular/common';
import { HammerService } from './private/service/hammer.service';
import { Subscription, fromEvent, asyncScheduler } from 'rxjs';

@Directive({
    selector: '[ngCarouselPreventGhostClick]',
})
export class PreventGhostClickDirective implements OnInit, OnDestroy {

    private hammerManager: HammerManager;
    private clickSubscription$: Subscription;
    private shouldPreventClick = false;

    constructor(
        private elementRef: ElementRef,
        private hammer: HammerService,
    ) {
    }

    ngOnInit() {
        this.listenPanEndEvents();
        this.listenClickEvents();
    }

    ngOnDestroy() {
        if (this.hammerManager) {
            this.hammerManager.destroy();
        }
        if (this.clickSubscription$) {
            this.clickSubscription$.unsubscribe();
        }
    }

    private listenPanEndEvents(): void {
        this.hammerManager = this.hammer.managerFor(this.elementRef.nativeElement);
        this.hammerManager.on('panend', () => {
            this.shouldPreventClick = true;
            asyncScheduler.schedule(() => {
                this.shouldPreventClick = false;
            });
        });
    }

    private listenClickEvents(): void {
        this.clickSubscription$ = fromEvent(this.elementRef.nativeElement, 'click')
            .subscribe((event: Event) => {
                if (this.shouldPreventClick) {
                    event.preventDefault();
                }
            });
    }

}
