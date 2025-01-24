import { Directive, Input, TemplateRef } from '@angular/core';

import { CarouselComponent } from './carousel.component';
import { CarouselSlideContext } from './private/models/carousel-slide-context';

@Directive({
    selector: '[ngCarouselSlide]',
    standalone: true
})
export class CarouselSlideDirective<T> {

    @Input() ngCarouselSlide: CarouselComponent<T> | null | '' = null;

    constructor(
        public templateRef: TemplateRef<CarouselSlideContext<T>>,
    ) {
    }

    static ngTemplateContextGuard<T>(dir: CarouselSlideDirective<T>, ctx: CarouselSlideContext<T>): ctx is CarouselSlideContext<T> {
        return true;
    }

}
