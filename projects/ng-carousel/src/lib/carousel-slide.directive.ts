import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[ngCarouselSlide]',
})
export class CarouselSlideDirective {

    constructor(
        public templateRef: TemplateRef<any>,
    ) {
    }

}
