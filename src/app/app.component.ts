import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { CarouselAlignMode, CarouselComponent, CarouselConfig, CarouselWidthMode } from '../../projects/ng-carousel/src/public-api';
import { CarouselItem } from './models/carousel-item.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {

    @ViewChild(CarouselComponent, {static: true}) carouselRef?: CarouselComponent;

    config: CarouselConfig<CarouselItem> = {
        widthMode: CarouselWidthMode.PERCENT,
        slideWidth: 100,
        transitionDuration: 2500,
        alignMode: CarouselAlignMode.CENTER,
        shouldLoop: true,
        items: this.assignItems(3),
        autoplayEnabled: true,
        dragEnabled: true,
        shouldRecalculateOnResize: true,
        recalculateDebounce: 300,
        allowKeyboardNavigation: true,
        initialIndex: ({ currentItemIndex }) => currentItemIndex,
    };
    readonly configForm = new FormGroup({
        widthMode: new FormControl(this.config.widthMode),
        alignMode: new FormControl(this.config.alignMode),
        slideWidth: new FormControl(this.config.slideWidth),
        transitionDuration: new FormControl(this.config.transitionDuration),
        shouldLoop: new FormControl(this.config.shouldLoop),
        slidesQuantity: new FormControl((this.config?.items ?? []).length),
        autoplayEnabled: new FormControl(this.config.autoplayEnabled),
        dragEnabled: new FormControl(this.config.dragEnabled),
        shouldRecalculateOnResize: new FormControl(this.config.shouldRecalculateOnResize),
        recalculateDebounce: new FormControl(this.config.recalculateDebounce),
        allowKeyboardNavigation: new FormControl(this.config.allowKeyboardNavigation),
    });
    readonly slideWidth$ = this.slideWidthChanges();
    readonly widthMode$ = this.widthModeChanges();
    readonly transitionDuration$ = this.transitionDurationChanges();
    readonly slidesQuantity$ = this.slidesQuantityChanges();
    readonly recalculateDebounce$ = this.recalculateDebounceChanges();
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

    setItemIndex(newIndex: number): void {
        this.itemIndex = newIndex;
    }

    emitLog(): void {
        console.log('Button was clicked');
    }

    private slideWidthChanges(): Observable<number | null | undefined> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {slideWidth?: number | null}) => form.slideWidth),
                startWith(this.configForm.controls.slideWidth.value),
            );
    }

    private widthModeChanges(): Observable<CarouselWidthMode | null | undefined> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {widthMode?: CarouselWidthMode | null}) => form.widthMode),
                startWith(this.configForm.controls.widthMode.value),
            );
    }

    private transitionDurationChanges(): Observable<number | null | undefined> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {transitionDuration?: number | null}) => form.transitionDuration),
                startWith(this.configForm.controls.transitionDuration.value),
            );
    }

    private slidesQuantityChanges(): Observable<number | null | undefined> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {slidesQuantity?: number | null}) => form.slidesQuantity),
                startWith(this.configForm.controls.slidesQuantity.value),
            );
    }

    private recalculateDebounceChanges(): Observable<number | null | undefined> {
        return this.configForm.valueChanges
            .pipe(
                map((form: {recalculateDebounce?: number | null}) => form.recalculateDebounce),
                startWith(this.configForm.controls.recalculateDebounce.value),
            );
    }

    private listenConfigChanges(): void {
        this.configForm.valueChanges
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe((value: CarouselConfig & {slidesQuantity?: number | null}) => {
                const maxWidthNew = this.getMaxWidth(value.widthMode);
                const widthPercentage = 100 * (value?.slideWidth ?? 1) / this.maxWidth;
                this.maxWidth = maxWidthNew;
                this.config = {
                    ...value,
                    slideWidth: Math.floor(maxWidthNew * widthPercentage / 100),
                    items: this.assignItems(value.slidesQuantity),
                    initialIndex: ({ currentItemIndex }) => currentItemIndex,
                };
                this.configForm.controls.slideWidth.setValue(value.slideWidth, {emitEvent: false});
                this.cdr.markForCheck();
            });
    }

    private getMaxWidth(mode?: CarouselWidthMode | null): number {
        return mode === CarouselWidthMode.PERCENT
            ? this.MAX_WIDTH_PERCENTS
            : this.MAX_WIDTH_PIXELS;
    }

    private assignItems(quantity?: number | null): CarouselItem[] {
        const items = [];
        for (let i = 0; i < (quantity ?? 3); i++) {
            items.push({name: i + 1, image: `url(https://placehold.co/150)`});
        }

        return items;
    }

}
