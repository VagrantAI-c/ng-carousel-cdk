import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CarouselComponent } from '../public-api';
import { CarouselSlideDirective } from './carousel-slide.directive';
import { FocusBlockDirective } from './private/directives/untabbable.directive';
import { CarouselEngineComponent } from './private/views/carousel-engine.component';

describe('VirtualCarouselComponent smoke test suite', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
            ],
            declarations: [
                CarouselComponent,
                CarouselSlideDirective,
                CarouselEngineComponent,
                FocusBlockDirective,
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
