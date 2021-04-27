import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMapTo, takeUntil } from 'rxjs/operators';

import { AutoplaySuspender } from '../models/autoplay-suspender';
import { CarouselError } from '../models/carousel-error';
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
export class CarouselEngineComponent<T> implements OnInit, OnDestroy {

    @ViewChild('galleryRef', {static: true}) galleryRef: ElementRef<HTMLElement> | null = null;
    public readonly transformValue$ = this.transformValueChanges();
    public readonly slideWidth$ = this.slideWidthChanges();
    public readonly template$ = this.templateChanges();
    public readonly slides$ = this.slidesChanges();
    public focused = false;
    private readonly destroyed$ = new Subject<void>();
    private mouseEnterDestructor: (() => void) | null = null;
    private mouseLeaveDestructor: (() => void) | null = null;
    private keyboardListener: (() => void) | null = null;
    private containerScrollListener: (() => void) | null = null;
    private visibilityListener: (() => void) | null = null;
    private hammerManager: HammerManager | null = null;

    private get htmlElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(
        private carousel: CarouselService<T>,
        private elementRef: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private hammer: HammerProviderService,
        @Inject(DOCUMENT) private document: Document,
        // tslint:disable-next-line: ban-types
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
    }

    ngOnInit(): void {
        this.listenToAutoplay();
        this.listenToDragEvents();
        this.listenToResizeEvents();
        this.listenToKeyEvents();
        this.listenToScrollEvents();
        this.listenToVisibilityEvents();
        if (this.galleryRef?.nativeElement) {
            this.carousel.setContainers(this.htmlElement, this.galleryRef?.nativeElement ?? null);
        } else {
            throw new CarouselError('Error initializing ng-carousel-cdk containers');
        }
    }

    ngOnDestroy(): void {
        this.mouseEnterDestructor?.();
        this.mouseLeaveDestructor?.();
        this.keyboardListener?.();
        this.containerScrollListener?.();
        this.visibilityListener?.();
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    trackByFn(index: number, item: CarouselSlide<T>): number {
        return item.id;
    }

    contextOf(slide: CarouselSlide<T>): CarouselSlideContext<T> {
        return {
            $implicit: slide.options.item,
            itemIndex: slide.itemIndex,
            isActive: slide.options.isActive,
            inViewport: slide.options.inViewport,
            activeOnTheLeft: slide.options.activeOnTheLeft,
            activeOnTheRight: slide.options.activeOnTheRight,
        };
    }

    focusIn(): void {
        this.focused = true;
        this.carousel.disableAutoplay(AutoplaySuspender.FOCUS);
    }

    focusOut(): void {
        this.focused = false;
        this.carousel.enableAutoplay(AutoplaySuspender.FOCUS);
    }


    private transformValueChanges(): Observable<string> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => `translateX(${state.offset}${state.config.widthMode})`),
            );
    }

    private slideWidthChanges(): Observable<string> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => `${state.config.slideWidth}${state.config.widthMode}`),
            );
    }

    private slidesChanges(): Observable<CarouselSlide<T>[]> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => state.slides),
            );
    }

    private templateChanges(): Observable<TemplateRef<CarouselSlideContext<T>> | null> {
        return this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => state.template),
            );
    }

    private listenToAutoplay(): void {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => state.config.autoplayEnabled),
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe((autoplayEnabled: boolean) => {
                this.mouseEnterDestructor?.();
                this.mouseLeaveDestructor?.();
                if (!autoplayEnabled) {

                    return;
                }
                this.mouseEnterDestructor = this.renderer.listen(
                    this.htmlElement,
                    'mouseenter',
                    () => this.carousel.disableAutoplay(AutoplaySuspender.MOUSE),
                );
                this.mouseLeaveDestructor = this.renderer.listen(
                    this.htmlElement,
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
                map((state: CarouselState<T>) => state.config.dragEnabled),
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
                this.hammerManager = this.hammer.managerFor(this.htmlElement);
                if (!this.hammerManager) {

                    return;
                }
                let lastDelta = 0;
                let lastTouchAction: string | null;

                this.hammerManager.on('panstart', (event: HammerInput) => {
                    // Checking whether pan started with horizontal gesture,
                    // we should block all scroll attempts during current pan session then
                    // tslint:disable-next-line: no-bitwise
                    if (event.offsetDirection & Hammer.DIRECTION_HORIZONTAL) {
                        lastDelta = Math.round(event.deltaX);
                        this.carousel.dragStart();
                        lastTouchAction = this.htmlElement.style.touchAction;
                        this.renderer.setStyle(this.htmlElement, 'touch-action', 'none');
                    }
                });

                this.hammerManager.on('panright panleft', (event: HammerInput) => {
                    // We should not treat vertical pans as horizontal.
                    // Be adviced that pan right/left events still counts
                    // vertical pans as legitimate horizontal pan.

                    // Next check clarifies that initial gesture was horizontal,
                    // otherwise this variable would be falsy
                    if (lastTouchAction) {
                        const x = Math.round(event.center.x);
                        const deltaX = Math.round(event.deltaX);
                        this.carousel.drag(x, x + (deltaX - lastDelta));
                        lastDelta = deltaX;
                    }
                });

                this.hammerManager.on('panend pancancel', (event: HammerInput) => {
                    if (lastTouchAction) {
                        this.carousel.dragEnd(event.deltaX);
                        this.renderer.setStyle(this.htmlElement, 'touch-action', lastTouchAction);
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
                filter((state: CarouselState<T>) => state.config.shouldRecalculateOnResize),
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
            this.htmlElement,
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
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.containerScrollListener = this.renderer.listen(this.htmlElement, 'scroll', () => {
            this.htmlElement.scrollTo(0, 0);
        });
    }

    private listenToVisibilityEvents(): void {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        if (this.document.hidden) {
            this.carousel.disableAutoplay(AutoplaySuspender.BLUR);
        }
        this.visibilityListener = this.renderer.listen(this.document, 'visibilitychange', () => {
            if (this.document.hidden) {
                this.carousel.disableAutoplay(AutoplaySuspender.BLUR);
            } else {
                this.carousel.enableAutoplay(AutoplaySuspender.BLUR);
            }
        });
    }
}
