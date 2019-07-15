import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CarouselSlideDirective } from './carousel-slide.directive';
import { CarouselComponent } from './carousel.component';
import { CarouselEngineComponent } from './private/views/carousel-engine.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
    ],
    declarations: [
        CarouselComponent,
        CarouselSlideDirective,
        CarouselEngineComponent,
    ],
    exports: [
        CarouselComponent,
        CarouselSlideDirective,
    ],
})
export class CarouselModule { }
