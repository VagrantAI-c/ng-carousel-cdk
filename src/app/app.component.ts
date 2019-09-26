import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { CarouselWidthMode, CarouselComponent, CarouselConfig, CarouselAlignMode } from '../../projects/ng-carousel/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {

    @ViewChild(CarouselComponent, {static: true}) carouselRef: CarouselComponent;

    config: Partial<CarouselConfig> = {
        widthMode: CarouselWidthMode.PERCENT,
        slideWidth: 100,
        transitionDuration: 2500,
        alignMode: CarouselAlignMode.CENTER,
        shouldLoop: true,
        items: this.assignItems(3),
        autoplayEnabled: true,
        dragEnabled: true,
    };
    readonly configForm = new FormGroup({
        widthMode: new FormControl(this.config.widthMode),
        alignMode: new FormControl(this.config.alignMode),
        slideWidth: new FormControl(this.config.slideWidth),
        transitionDuration: new FormControl(this.config.transitionDuration),
        shouldLoop: new FormControl(this.config.shouldLoop),
        slidesQuantity: new FormControl(this.config.items.length),
        autoplayEnabled: new FormControl(this.config.autoplayEnabled),
        dragEnabled: new FormControl(this.config.dragEnabled),
    });
    readonly slideWidth$ = this.slideWidthChanges();
    readonly widthMode$ = this.widthModeChanges();
    readonly transitionDuration$ = this.transitionDurationChanges();
    readonly slidesQuantity$ = this.slidesQuantityChanges();
    readonly PX = CarouselWidthMode.PX;
    readonly PERCENT = CarouselWidthMode.PERCENT;
    readonly LEFT = CarouselAlignMode.LEFT;
    readonly CENTER = CarouselAlignMode.CENTER;
    itemIndex = 0;
    maxWidth = 0;
    readonly MAX_WIDTH_PERCENTS = 110;
    readonly MAX_WIDTH_PIXELS = 1000;
    private readonly destroyed$ = new Subject<void>();

    constructor(
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.maxWidth = this.getMaxWidth(this.config.widthMode);
        this.listenConfigChanges();
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    prev(): void {
        this.carouselRef.prev();
    }

    next(): void {
        this.carouselRef.next();
    }

    goTo(index: number): void {
        this.carouselRef.setIndex(index);
    }

    setItemIndex(newIndex: number): void {
        this.itemIndex = newIndex;
    }

    private slideWidthChanges(): Observable<number> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {slideWidth: number}) => form.slideWidth),
                startWith(this.configForm.controls.slideWidth.value),
            );
    }

    private widthModeChanges(): Observable<CarouselWidthMode> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {widthMode: CarouselWidthMode}) => form.widthMode),
                startWith(this.configForm.controls.widthMode.value),
            );
    }

    private transitionDurationChanges(): Observable<number> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {transitionDuration: number}) => form.transitionDuration),
                startWith(this.configForm.controls.transitionDuration.value),
            );
    }

    private slidesQuantityChanges(): Observable<number> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {slidesQuantity: number}) => form.slidesQuantity),
                startWith(this.configForm.controls.slidesQuantity.value),
            );
    }

    private listenConfigChanges(): void {
        this.configForm.valueChanges
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe((value: CarouselConfig & {slidesQuantity: number}) => {
                const maxWidthNew = this.getMaxWidth(value.widthMode);
                const widthPercentage = 100 * value.slideWidth / this.maxWidth;
                value.slideWidth = Math.floor(maxWidthNew * widthPercentage / 100);
                this.maxWidth = maxWidthNew;
                this.config = value;
                this.configForm.controls.slideWidth.setValue(value.slideWidth, {emitEvent: false});
                this.config.items = this.assignItems(value.slidesQuantity);
                this.cdr.markForCheck();
            });
    }

    private getMaxWidth(mode: CarouselWidthMode): number {
        return mode === CarouselWidthMode.PERCENT
            ? this.MAX_WIDTH_PERCENTS
            : this.MAX_WIDTH_PIXELS;
    }

    private assignItems(quantity: number): any[] {
        const items = [];
        for (let i = 0; i < quantity; i++) {
            items.push({name: i + 1, image: `url(https://via.placeholder.com/150)`});
        }

        return items;
    }

}
