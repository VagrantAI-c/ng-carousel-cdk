import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CarouselSlideDirective } from './carousel-slide.directive';
import { CarouselComponent } from './carousel.component';
import { CarouselPreventGhostClickModule } from './prevent-ghost-click.module';
import { FocusBlockDirective } from './private/directives/untabbable.directive';
import { CarouselEngineComponent } from './private/views/carousel-engine.component';

@NgModule({
    imports: [
        CommonModule,
        A11yModule,
        CarouselPreventGhostClickModule,
    ],
    declarations: [
        CarouselComponent,
        CarouselSlideDirective,
        CarouselEngineComponent,
        FocusBlockDirective,
    ],
    exports: [
        CarouselComponent,
        CarouselSlideDirective,
        CarouselPreventGhostClickModule,
    ],
})
export class CarouselModule { }
