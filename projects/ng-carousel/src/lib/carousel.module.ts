import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CarouselSlideDirective } from './carousel-slide.directive';
import { CarouselComponent } from './carousel.component';
import { PreventGhostClickDirective } from './prevent-ghost-click.directive';
import { FocusBlockDirective } from './private/directives/untabbable.directive';
import { CarouselEngineComponent } from './private/views/carousel-engine.component';

@NgModule({
    imports: [
        CommonModule,
        A11yModule,
    ],
    declarations: [
        CarouselComponent,
        CarouselSlideDirective,
        CarouselEngineComponent,
        FocusBlockDirective,
        PreventGhostClickDirective,
    ],
    exports: [
        CarouselComponent,
        CarouselSlideDirective,
        PreventGhostClickDirective,
    ],
})
export class CarouselModule { }
