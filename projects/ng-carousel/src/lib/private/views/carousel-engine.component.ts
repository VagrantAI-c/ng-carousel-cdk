import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { combineLatest, interval, NEVER, Observable, of, Subject, Subscriber } from 'rxjs';
import { debounce, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';

import { AutoplaySuspender } from '../models/autoplay-suspender';
import { CarouselError } from '../models/carousel-error';
import { CarouselSlide } from '../models/carousel-slide';
import { CarouselSlideContext } from '../models/carousel-slide-context';
import { CarouselState } from '../models/carousel-state';
import { CarouselService } from '../service/carousel.service';
import { PanRecognizerService } from '../service/pan-recognizer.service';

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
    public slides: CarouselSlide[] | null = null;
    public templateRef: TemplateRef<CarouselSlideContext<T>> | null = null;
    public focused = false;
    private readonly destroyed$ = new Subject<void>();
    private mouseEnterDestructor: (() => void) | null = null;
    private mouseLeaveDestructor: (() => void) | null = null;
    private keyboardListener: (() => void) | null = null;
    private containerScrollListener: (() => void) | null = null;
    private visibilityListener: (() => void) | null = null;
    private readonly htmlElement = this.elementRef.nativeElement;

    constructor(
        private carousel: CarouselService<T>,
        private elementRef: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private zone: NgZone,
        private panRecognizer: PanRecognizerService<T>,
        private cdr: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
        // tslint:disable-next-line: ban-types
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.cdr.detach();
    }

    ngOnInit(): void {
        this.listenToAutoplay();
        this.listenToDragEvents();
        this.listenToResizeEvents();
        this.listenToKeyEvents();
        this.listenToScrollEvents();
        this.listenToVisibilityEvents();
        this.listenSlideChanges();
        this.listenContainerStyleChanges();
        this.listenTemplateChanges();
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

    focusIn(): void {
        this.focused = true;
        this.carousel.disableAutoplay(AutoplaySuspender.FOCUS);
    }

    focusOut(): void {
        this.focused = false;
        this.carousel.enableAutoplay(AutoplaySuspender.FOCUS);
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
                this.zone.runOutsideAngular(() => {
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
                switchMap((dragEnabled: boolean) => dragEnabled
                    ? this.panRecognizer.listen(this.htmlElement)
                    : NEVER
                ),
                takeUntil(this.destroyed$),
            )
            .subscribe();
    }

    private listenToResizeEvents(): void {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => state.config.shouldRecalculateOnResize),
                distinctUntilChanged(),
                switchMap((shouldRecalculate: boolean) => shouldRecalculate
                    ? this.fromElementResize(this.elementRef.nativeElement)
                    : NEVER
                ),
                debounce(() => this.carousel.carouselStateChanges()
                    .pipe(
                        map((state: CarouselState<T>) => state.config.recalculateDebounce),
                        distinctUntilChanged(),
                        switchMap((debounceTime: number) => interval(debounceTime)),
                    )
                ),
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
        this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => state.config.allowKeyboardNavigation),
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe((canListen: boolean) => {
                this.keyboardListener?.();
                if (!canListen) {

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
            });
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

    private fromElementResize(element: HTMLElement | null): Observable<void> {
        if (!element || !isPlatformBrowser(this.platformId)) {
            return NEVER;
        }

        return new Observable<void>((subscriber: Subscriber<void>) => {
            const observer = new ResizeObserver(() => {
                subscriber.next();
            });
            observer.observe(element);

            return () => {
                observer.disconnect();
            };
        });
    }

    private listenSlideChanges(): void {
        this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => state.slides),
                takeUntil(this.destroyed$),
            )
            .subscribe((slides: CarouselSlide[]) => {
                this.slides = slides ?? [];
                this.cdr.detectChanges();
            });
    }

    private listenContainerStyleChanges(): void {
        this.carousel.carouselStateChanges()
            .pipe(
                switchMap((state: CarouselState<T>) => combineLatest([
                    of(`translateX(${state.offset}${state.config.widthMode})`)
                        .pipe(
                            distinctUntilChanged(),
                        ),
                    of(`${state.config.slideWidth}${state.config.widthMode}`)
                        .pipe(
                            distinctUntilChanged(),
                        ),
                    of(state.animatableContainer)
                        .pipe(
                            distinctUntilChanged(),
                        ),
                ])),
                takeUntil(this.destroyed$),
            )
            .subscribe(([transform, width, container]: [string, string, HTMLElement | null]) => {
                if (container) {
                    this.renderer.setProperty(container, 'style', `transform:${transform};--ng-carousel-sw:${width}`);
                }
            });
    }

    private listenTemplateChanges(): void {
        this.carousel.carouselStateChanges()
            .pipe(
                map((state: CarouselState<T>) => state.template),
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe((template: TemplateRef<CarouselSlideContext<T>> | null) => {
                this.templateRef = template;
                this.cdr.detectChanges();
            });
    }
}
