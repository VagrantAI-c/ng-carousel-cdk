import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CarouselModule } from '../../projects/ng-carousel/src/public-api';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserModule,
                NoopAnimationsModule,
                MatToolbarModule,
                MatButtonModule,
                MatCardModule,
                MatSliderModule,
                MatButtonToggleModule,
                MatCheckboxModule,
                CarouselModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            declarations: [
                AppComponent
            ],
        }).compileComponents();
    }));

    // Temporary disable due to:
    // TypeError: Cannot read properties of undefined (reading 'removeEventListener')
    // at MatSliderVisualThumb.call
    xit('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
