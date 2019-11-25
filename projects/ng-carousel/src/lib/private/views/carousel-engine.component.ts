import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMapTo, takeUntil } from 'rxjs/operators';

import { AutoplaySuspender } from '../models/autoplay-suspender';
import { CarouselSlide } from '../models/carousel-slide';
import { CarouselSlideContext } from '../models/carousel-slide-context';
import { CarouselState } from '../models/carousel-state';
import { CarouselService } from '../service/carousel.service';
import { HammerProviderService } from '../service/hammer-provider.service';

@Component({
  selector: 'carousel-engine',
  templateUrl: './carousel-engine.component.html',
  styleUrls: ['./carousel-engine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/**
 * Contains listeners and other DOM controllers
 */
export class CarouselEngineComponent implements OnInit, OnDestroy {

    @ViewChild('galleryRef', {static: true}) galleryRef: ElementRef;
    public readonly transformValue$ = this.transformValueChanges();
    public readonly slideWidth$ = this.slideWidthChanges();
    public readonly template$ = this.templateChanges();
    public readonly slides$ = this.slidesChanges();
    public focused = false;
    private readonly destroyed$ = new Subject<void>();
    private mouseEnterDestructor: () => void;
    private mouseLeaveDestructor: () => void;
    private keyboardListener: () => void;
    private containerScrollListener: () => void;
    private hammerManager: HammerManager;

    constructor(
        private carousel: CarouselService,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private hammer: HammerProviderService,
        // tslint:disable-next-line: ban-types
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: any,
    ) {
    }

    ngOnInit() {
        this.listenToAutoplay();
        this.listenToDragEvents();
        this.listenToResizeEvents();
        this.listenToKeyEvents();
        this.listenToScrollEvents();
        this.carousel.setContainers(this.elementRef.nativeElement, this.galleryRef.nativeElement);
    }

    ngOnDestroy() {
        this.destroyMouseListeners();
        this.destroyHammer();
        this.destroyKeyboardListeners();
        this.destroyElementScrollListener();
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    trackByFn(index: number, item: CarouselSlide): number {
        return item.id;
    }

    contextOf(slide: CarouselSlide): CarouselSlideContext {
        return new CarouselSlideContext(
            slide.options.item,
            slide.options.isActive,
            slide.options.inViewport,
        );
    }

    focusIn(): void {
        this.focused = true;
        this.carousel.disableAutoplay(AutoplaySuspender.FOCUS);
    }

    focusOut(): void {
        this.focused = false;
        this.carousel.enableAutoplay(AutoplaySuspender.FOCUS);
    }

    private destroyMouseListeners(): void {
        if (this.mouseEnterDestructor) {
            this.mouseEnterDestructor();
        }
        if (this.mouseLeaveDestructor) {
            this.mouseLeaveDestructor();
        }
    }

    private destroyHammer(): void {
        if (this.hammerManager) {
            this.hammerManager.destroy();
        }
    }

    private destroyKeyboardListeners(): void {
        if (this.keyboardListener) {
            this.keyboardListener();
        }
    }

    private destroyElementScrollListener(): void {
        if (this.containerScrollListener) {
            this.containerScrollListener();
        }
    }

    private transformValueChanges(): Observable<string> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState) => `translateX(${state.offset}${state.config.widthMode})`),
            );
    }

    private slideWidthChanges(): Observable<string> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState) => `${state.config.slideWidth}${state.config.widthMode}`),
            );
    }

    private slidesChanges(): Observable<CarouselSlide[]> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState) => state.slides),
            );
    }

    private templateChanges(): Observable<TemplateRef<any>> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState) => state.template),
            );
    }

    private listenToAutoplay(): void {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState) => state.config.autoplayEnabled),
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe((autoplayEnabled: boolean) => {
                if (this.mouseEnterDestructor) {
                    this.mouseEnterDestructor();
                }
                if (this.mouseLeaveDestructor) {
                    this.mouseLeaveDestructor();
                }
                if (!autoplayEnabled) {

                    return;
                }
                this.mouseEnterDestructor = this.renderer.listen(
                    this.elementRef.nativeElement,
                    'mouseenter',
                    () => this.carousel.disableAutoplay(AutoplaySuspender.MOUSE),
                );
                this.mouseLeaveDestructor = this.renderer.listen(
                    this.elementRef.nativeElement,
                    'mouseleave',
                    () => this.carousel.enableAutoplay(AutoplaySuspender.MOUSE),
                );
            });
    }

    private listenToDragEvents(): void {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState) => state.config.dragEnabled),
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe((dragEnabled: boolean) => {
                if (this.hammerManager) {
                    this.hammerManager.destroy();
                }
                if (!dragEnabled) {

                    return;
                }
                this.hammerManager = this.hammer.managerFor(this.elementRef.nativeElement);
                if (!this.hammerManager) {

                    return;
                }
                let lastDelta = 0;
                let lastTouchAction: string;

                this.hammerManager.on('panstart', (event: HammerInput) => {
                    // Checking whether pan started with horizontal gesture,
                    // we should block all scroll attempts during current pan session then
                    // tslint:disable-next-line: no-bitwise
                    if (event.offsetDirection & Hammer.DIRECTION_HORIZONTAL) {
                        lastDelta = event.deltaX;
                        this.carousel.dragStart();
                        lastTouchAction = this.elementRef.nativeElement.style.touchAction;
                        this.renderer.setStyle(this.elementRef.nativeElement, 'touch-action', 'none');
                    }
                });

                this.hammerManager.on('panright panleft', (event: HammerInput) => {
                    // We should not treat vertical pans as horizontal.
                    // Be adviced that pan right/left events still counts
                    // vertical pans as legitimate horizontal pan.

                    // Next check clarifies that initial gesture was horizontal,
                    // otherwise this variable would be falsy
                    if (lastTouchAction) {
                        this.carousel.drag(event.center.x, event.center.x + (event.deltaX - lastDelta));
                        lastDelta = event.deltaX;
                    }
                });

                this.hammerManager.on('panend pancancel', (event: HammerInput) => {
                    if (lastTouchAction) {
                        this.carousel.dragEnd(event.deltaX);
                        this.renderer.setStyle(this.elementRef.nativeElement, 'touch-action', lastTouchAction);
                        lastTouchAction = null;
                    }
                });
            });
    }

    private listenToResizeEvents(): void {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.carousel.carouselStateChanges()
            .pipe(
                filter((state: CarouselState) => state.config.shouldRecalculateOnResize),
                switchMapTo(fromEvent(window, 'resize')),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this.carousel.recalculate();
            });
    }

    private listenToKeyEvents(): void {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.keyboardListener = this.renderer.listen(
            this.elementRef.nativeElement,
            'keydown',
            (event: KeyboardEvent) => {
                const key = event.key.toLowerCase();
                if (['arrowright', 'right'].includes(key)) {
                    this.carousel.next();
                } else if (['arrowleft', 'left'].includes(key)) {
                    this.carousel.prev();
                }
            }
        );
    }

    /**
     * Horizontal scroll might accidentaly happen on parent container
     * when pressing arrow buttons too fast. We should return
     * container to initial position when that happens.
     */
    private listenToScrollEvents(): void {
        this.containerScrollListener = this.renderer.listen(this.elementRef.nativeElement, 'scroll', () => {
            this.elementRef.nativeElement.scrollTo(0, 0);
        });
    }
}
