import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CarouselSlideDirective } from './carousel-slide.directive';
import { CarouselComponent } from './carousel.component';
import { FocusBlockDirective } from './private/directives/untabbable.directive';
import { CarouselEngineComponent } from './private/views/carousel-engine.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        A11yModule,
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
    ],
})
export class CarouselModule { }
