import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CarouselModule } from '../../projects/ng-carousel/src/public-api';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
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
    providers: [],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule { }
