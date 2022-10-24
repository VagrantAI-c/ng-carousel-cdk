import { ChangeDetectionStrategy, Component, ContentChild, Input, Output, ViewEncapsulation } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { CarouselConfig } from './carousel-config.type';
import { CarouselSlideDirective } from './carousel-slide.directive';
import { CompleteCarouselConfig } from './private/models/carousel-config';
import { CarouselState } from './private/models/carousel-state';
import { IdGenerator } from './private/models/id-generator';
import { CarouselService } from './private/service/carousel.service';
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
})
/**
 * Defines carousel API to work with
 */
export class CarouselComponent<T = any> {

    @ContentChild(CarouselSlideDirective) set slideRef(newSlideRef: CarouselSlideDirective<T>) {
        this.carousel.setSlideTemplate(newSlideRef
            ? newSlideRef.templateRef
            : null
        );
    }

    @Input() set config(newConfig: CarouselConfig<T> | null | undefined) {
        const configInstance = new CompleteCarouselConfig<T>(newConfig);
        this.carousel.setConfig(configInstance);
    }

    @Output() itemIndexChange = this.carousel.carouselStateChanges()
        .pipe(
            map((state: CarouselState<T>) => state.activeItemIndex),
            distinctUntilChanged(),
        );

    get slideIndex(): number {
        return this.carousel.getItemIndex();
    }

    constructor(
        private carousel: CarouselService<T>,
    ) {
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

}
