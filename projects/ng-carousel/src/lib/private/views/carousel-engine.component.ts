import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, isDevMode, OnDestroy, OnInit, PLATFORM_ID, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { CarouselSlide } from '../models/carousel-slide';
import { CarouselSlideContext } from '../models/carousel-slide-context';
import { CarouselState } from '../models/carousel-state';
import { CarouselService } from '../service/carousel.service';
import { AutoplaySuspender } from '../models/autoplay-suspender';

@Component({
  selector: 'carousel-engine',
  templateUrl: './carousel-engine.component.html',
  styleUrls: ['./carousel-engine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CarouselEngineComponent implements OnInit, OnDestroy {

    @ViewChild('galleryRef', {static: true}) galleryRef: ElementRef;
    public readonly transformValue$ = this.transformValueChanges();
    public readonly slideWidth$ = this.slideWidthChanges();
    public readonly template$ = this.templateChanges();
    public readonly slides$ = this.slidesChanges();
    private readonly destroyed$ = new Subject<void>();
    private mouseEnterDestructor: () => void;
    private mouseLeaveDestructor: () => void;
    private hammerManager: HammerManager;
    private hammerAbsenceDeclared = false;

    constructor(
        private carousel: CarouselService,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
    }

    ngOnInit() {
        this.listenToAutoplay();
        this.listenToDrag();
        this.carousel.setContainers(this.elementRef.nativeElement, this.galleryRef.nativeElement);
    }

    ngOnDestroy() {
        if (this.mouseEnterDestructor) {
            this.mouseEnterDestructor();
        }
        if (this.mouseLeaveDestructor) {
            this.mouseLeaveDestructor();
        }
        if (this.hammerManager) {
            this.hammerManager.destroy();
        }
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
        this.carousel.disableAutoplay(AutoplaySuspender.FOCUS);
    }

    focusOut(): void {
        this.carousel.enableAutoplay(AutoplaySuspender.FOCUS);
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

    private listenToDrag(): void {
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
                const hasGestures = isPlatformBrowser(this.platformId) && (window as any).Hammer;
                if (!hasGestures) {
                    if (isDevMode() && !this.hammerAbsenceDeclared) {
                        console.warn(
                            'Ng-carousel could not listen to drag, because HammerJS was not found. Either disable drag or import HammerJS.'
                        );
                        this.hammerAbsenceDeclared = true;
                    }

                    return;
                }
                this.hammerManager = new Hammer(this.elementRef.nativeElement);

                let lastDelta = 0;
                this.hammerManager.on('panright panleft', (event: HammerInput) => {
                    this.carousel.drag(event.center.x, event.center.x + (event.deltaX - lastDelta));
                    lastDelta = event.deltaX;
                });
                this.hammerManager.on('panstart', (event: HammerInput) => {
                    lastDelta = event.deltaX;
                    this.carousel.dragStart();
                });
                this.hammerManager.on('panend', (event: HammerInput) => {
                    this.carousel.dragEnd(event.deltaX);
                });
            });
    }

}
