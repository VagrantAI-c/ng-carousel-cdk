import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Input, NgZone, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { concat, of, ReplaySubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { CarouselConfig } from './carousel-config.type';
import { CarouselSlideDirective } from './carousel-slide.directive';
import { CompleteCarouselConfig } from './private/models/carousel-config';
import { CarouselState } from './private/models/carousel-state';
import { IdGenerator } from './private/models/id-generator';
import { CarouselService } from './private/service/carousel.service';
import { enterZone } from './private/service/helpers/enter-zone';
import { PanRecognizerService } from './private/service/pan-recognizer.service';
import { ANIMATION_ID_GENERATOR, SLIDE_ID_GENERATOR } from './private/tokens';

export function idGeneratorFactory(): IdGenerator {
    return new IdGenerator();
}

@Component({
    selector: 'ng-carousel',
    templateUrl: 'carousel.component.html',
    styleUrls: ['carousel.component.scss'],
    providers: [
        CarouselService,
        PanRecognizerService,
        {
            provide: SLIDE_ID_GENERATOR,
            useFactory: idGeneratorFactory,
        },
        {
            provide: ANIMATION_ID_GENERATOR,
            useFactory: idGeneratorFactory,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'ngCarousel',
    standalone: false
})
/**
 * Defines carousel API to work with
 */
export class CarouselComponent<T = any> implements OnDestroy {

    @ContentChild(CarouselSlideDirective) set slideRef(newSlideRef: CarouselSlideDirective<T>) {
        this.carousel.setSlideTemplate(newSlideRef
            ? newSlideRef.templateRef
            : null
        );
    }

    @Input() set config(newConfig: CarouselConfig<T> | null | undefined) {
        const configInstance = new CompleteCarouselConfig<T>(newConfig);
        this.config$.next(configInstance);
        this.listenConfigChanges();
    }

    @Output() itemIndexChange = this.carousel.carouselStateChanges()
        .pipe(
            map((state: CarouselState<T>) => state.activeItemIndex),
            distinctUntilChanged(),
            enterZone(this.ngZone),
        );

    get slideIndex(): number {
        return this.carousel.getItemIndex();
    }

    get items(): T[] {
        return this.unwrappedItems;
    }

    private readonly config$ = new ReplaySubject<CompleteCarouselConfig<T>>(1);
    private readonly subscriptions$ = new Subscription();
    private configListenerInitialized = false;
    private unwrappedItems: T[] = [];

    constructor(
        private carousel: CarouselService<T>,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnDestroy(): void {
        this.subscriptions$.unsubscribe();
    }

    next(): void {
        this.carousel.next();
    }

    prev(): void {
        this.carousel.prev();
    }

    setIndex(newIndex: number): void {
        this.carousel.setItemIndex(newIndex);
    }

    /**
     * Programmaticaly recalculates carousel position in case of
     * container size changes or other size interactions
     */
    recalculate(): void {
        this.carousel.recalculate();
    }

    private listenConfigChanges(): void {
        if (this.configListenerInitialized) {

            return;
        }
        this.configListenerInitialized = true;
        const configSubscription$ = this.config$
            .pipe(
                switchMap((config: CompleteCarouselConfig<T>) =>
                    concat(of(config.items), config.items$)
                        .pipe(
                            map((items: T[]) => ({ ...config, items })),
                        )
                ),
            )
            .subscribe((config: CompleteCarouselConfig<T>) => {
                this.unwrappedItems = config.items;
                this.cdr.markForCheck();
                this.carousel.setConfig(config);
            });
        this.subscriptions$.add(configSubscription$);
    }

}
