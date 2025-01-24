import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AutoplaySuspender } from '../models/autoplay-suspender';
import { CompleteCarouselConfig } from '../models/carousel-config';
import { CarouselState } from '../models/carousel-state';
import { IdGenerator } from '../models/id-generator';
import { ProcedureEnvironment } from '../models/procedure/procedure-environment.interface';
import { procedurePipe } from '../models/procedure/procedure-pipe/procedure-pipe';
import { Procedure } from '../models/procedure/procedure.type';
import { SLIDE_ID_GENERATOR } from '../tokens';
import { disableAutoplayProcedure } from './helpers/disable-autoplay/disable-autoplay-procedure';
import { enableAutoplayProcedure } from './helpers/enable-autoplay/enable-autoplay-procedure';
import { cleanupProcedure } from './procedures/cleanup-procedure';
import { dragEndProcedure } from './procedures/drag-end-procedure';
import { dragProcedure } from './procedures/drag-procedure';
import { dragStartProcedure } from './procedures/drag-start-procedure';
import { goToProcedure } from './procedures/go-to-procedure';
import { initializeConfigProcedure } from './procedures/initialize-config-procedure';
import { initializeContainersProcedure } from './procedures/initialize-containers-procedure';
import { nextProcedure } from './procedures/next-procedure';
import { prevProcedure } from './procedures/prev-procedure';
import { recalculateProcedure } from './procedures/recalculate-procedure';
import { ANIMATION_BEZIER_ARGS } from './procedures/set-beziers/set-beziers-procedure';
import { setTemplateProcedure } from './procedures/set-template/set-template-procedure';


/**
 * Short swipe might not change slide to next/prev.
 * This const specifies how much (% of viewport) swipe
 * should overcome to trigger next/prev slide change.
 */
const MAX_SWIPE_THRESHOLD = 15;
/**
 * How much % user can stretch carousel, when there's no more
 * drag available
 */
const MAX_OVERSCROLL = 10;

@Injectable()
export class CarouselService<T> implements OnDestroy {

    private readonly carouselState$ = new BehaviorSubject<CarouselState<T>>(new CarouselState<T>());
    /** Describes constant entities for procedures */
    private readonly procedureEnvironment: ProcedureEnvironment = {
        slideIdGenerator: this.slideIdGenerator,
        isBrowser: isPlatformBrowser(this.platformId),
        autoplayAction: this.next.bind(this, true),
        afterAnimationAction: this.cleanup.bind(this),
        animationBezierArgs: ANIMATION_BEZIER_ARGS,
        swipeThreshold: MAX_SWIPE_THRESHOLD,
        maxOverscroll: MAX_OVERSCROLL,
        zone: this.ngZone,
    };

    constructor(
        @Inject(SLIDE_ID_GENERATOR) private slideIdGenerator: IdGenerator,
        // tslint:disable-next-line: ban-types
        @Inject(PLATFORM_ID) private platformId: Object,
        private ngZone: NgZone,
    ) {
    }

    ngOnDestroy(): void {
        this.carouselState$.getValue()?.autoplay?.autoplaySubscription?.unsubscribe();
    }

    getItemIndex(): number {
        return this.carouselState$.getValue().activeItemIndex;
    }

    carouselStateChanges(): Observable<CarouselState<T>> {
        return this.carouselState$.asObservable();
    }

    setItemIndex(newItemIndex: number): void {
        this.apply(goToProcedure(newItemIndex, false));
    }

    prev(): void {
        this.apply(prevProcedure());
    }

    /**
     * @param omitAutoplayReset whether autoplay timer should not be resetted
     */
    next(omitAutoplayReset = false): void {
        this.apply(nextProcedure(omitAutoplayReset));
    }

    recalculate(): void {
        this.apply(recalculateProcedure());
    }

    /** Update state to announce that drag sequence just started */
    dragStart(): void {
        this.apply(dragStartProcedure());
    }

    /**
     * Update state to announce that drag sequence just ended
     * and perform necessary cleanups
     */
    dragEnd(passedDistance: number): void {
        this.apply(dragEndProcedure(passedDistance));
    }

    /** Process single drag tick with given from and to coordinates */
    drag(fromX: number, toX: number): void {
        this.apply(dragProcedure(fromX, toX));
    }

    setSlideTemplate(newTemplateRef: TemplateRef<any> | null): void {
        this.apply(setTemplateProcedure(newTemplateRef));
    }

    disableAutoplay(suspender: AutoplaySuspender): void {
        this.apply(disableAutoplayProcedure(suspender));
    }

    /**
     * Starts new autoplay timer
     */
    enableAutoplay(suspender: AutoplaySuspender | null = null): void {
        this.apply(enableAutoplayProcedure(suspender));
    }

    setContainers(widthContainer: HTMLElement, animatableContainer: HTMLElement): void {
        this.apply(initializeContainersProcedure(widthContainer, animatableContainer));
    }

    setConfig(newConfig: CompleteCarouselConfig<T>): void {
        this.apply(initializeConfigProcedure(newConfig));
    }

    private cleanup(): void {
        this.apply(cleanupProcedure());
    }

    /**
     * Applies specified procedure to carousel state
     */
    private apply(procedure: Procedure): void {
        const state: CarouselState<T> = Object.assign({}, this.carouselState$.getValue());
        const result = procedurePipe('applier', procedure)({
            state,
            procedureState: {
                activeItemIndex: state.activeItemIndex,
            },
            environment: this.procedureEnvironment
        });
        this.carouselState$.next(result.state);
    }
}
