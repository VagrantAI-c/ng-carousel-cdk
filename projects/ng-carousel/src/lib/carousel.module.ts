import { AsyncPipe, NgForOf, NgTemplateOutlet } from '@angular/common';
import { NgModule } from '@angular/core';

import { CarouselSlideDirective } from './carousel-slide.directive';
import { CarouselComponent } from './carousel.component';
import { CarouselPreventGhostClickModule } from './prevent-ghost-click.module';
import { CarouselEngineComponent } from './private/views/carousel-engine.component';
import { CarouselUntabbableDirective } from './private/directives/untabbable.directive';

@NgModule({
    imports: [
        NgForOf,
        AsyncPipe,
        NgTemplateOutlet,
        CarouselPreventGhostClickModule,
        CarouselUntabbableDirective,
        CarouselComponent,
        CarouselSlideDirective,
        CarouselEngineComponent,
    ],
    exports: [
        CarouselComponent,
        CarouselSlideDirective,
        CarouselPreventGhostClickModule,
    ],
})
export class CarouselModule { }
