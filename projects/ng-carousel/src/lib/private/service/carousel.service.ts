import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { Inject, Injectable, OnDestroy, TemplateRef } from '@angular/core';
import bezier from 'bezier-easing';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CarouselConfig } from '../../carousel-config';
import { CarouselWidthMode } from '../../carousel-width-mode';
import { AutoplaySuspender } from '../models/autoplay-suspender';
import { CarouselAnimation } from '../models/carousel-animation';
import { CarouselAutoplay } from '../models/carousel-autoplay';
import { CarouselError } from '../models/carousel-error';
import { CarouselSlide } from '../models/carousel-slide';
import { CarouselState } from '../models/carousel-state';
import { IdGenerator } from '../models/id-generator';
import { Offset } from '../models/offset';
import { ANIMATION_ID_GENERATOR, SLIDE_ID_GENERATOR } from '../tokens';
import { animationOffsetSnapshot } from './helpers/animation-offset-snapshot';
import { calculateActiveSlide } from './helpers/calculate-active-slide';
import { calculateOffset } from './helpers/calculate-offset';
import { dragOffsetSnapshot } from './helpers/drag-offset-snapshot';
import { findSlideIndex } from './helpers/find-slide-index';
import { initializeCarousel } from './helpers/initialize-carousel';
import { markVisibleAndActive } from './helpers/mark-visible-and-active';
import { removeCopies } from './helpers/remove-copies';
import { shuffleSlides } from './helpers/shuffle-slides';

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

// Reference: https://easings.net/ru
// Standard ease
const ANIMATION_BEZIER_ARGS = [0.25, 0.1, 0.25, 1];
// Ease out quad
const DRAG_BEZIER_ARGS = [0.25, 0.46, 0.45, 0.94];

@Injectable()
export class CarouselService implements OnDestroy {

    private readonly carouselState$ = new BehaviorSubject<CarouselState>(new CarouselState());
    private readonly destroyed$ = new Subject<void>();
    private currentAnimationId: number | null = null;

    constructor(
        private animation: AnimationBuilder,
        @Inject(ANIMATION_ID_GENERATOR) private animationIdGenerator: IdGenerator,
        @Inject(SLIDE_ID_GENERATOR) private slideIdGenerator: IdGenerator
    ) {
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    carouselStateChanges(): Observable<CarouselState> {
        return this.carouselState$.asObservable();
    }

    setItemIndex(newItemIndex: number): void {
        this.enableAutoplay(); // Reset timer on programmatic item index change
        const carouselState = this.cloneCarouselState();
        const slideIndex = findSlideIndex(
            carouselState.slides,
            newItemIndex,
            carouselState.activeSlideIndex,
        );
        this.setSlideIndex(slideIndex);
    }

    prev(): void {
        this.enableAutoplay(); // Reset timer on programmatic prev
        const carouselState = this.cloneCarouselState();
        let newIndex = carouselState.activeSlideIndex - 1;
        if (newIndex < 0) {
            newIndex = carouselState.slides.length - 1;
        }
        this.setSlideIndex(newIndex);
    }

    /**
     * @param omitAutoplayReset whether autoplay timer should not be resetted
     */
    next(omitAutoplayReset = false): void {
        if (!omitAutoplayReset) {
            this.enableAutoplay();
        }
        const carouselState = this.cloneCarouselState();
        let newIndex = carouselState.activeSlideIndex + 1;
        if (newIndex >= carouselState.slides.length) {
            newIndex = 0;
        }
        this.setSlideIndex(newIndex);
    }

    recalculate(): void {
        const carouselState = this.cloneCarouselState();
        const viewportWidth = carouselState.viewportWidth;
        carouselState.offset = calculateOffset(
            carouselState.activeSlideIndex,
            carouselState.config.alignMode,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.slides.length,
            carouselState.config.shouldLoop,
        );
        carouselState.slides = markVisibleAndActive(
            carouselState.slides,
            carouselState.offset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.activeSlideIndex,
        );
        const shuffleSlideResult = shuffleSlides(
            carouselState.slides,
            carouselState.offset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.config.items,
            carouselState.config.shouldLoop,
            this.slideIdGenerator,
        );
        carouselState.offset = shuffleSlideResult.modifiedOffset;
        carouselState.slides = shuffleSlideResult.slides;
        this.setCarouselState(carouselState);
    }

    /** Update state to announce that drag sequence just started */
    dragStart(): void {
        const carouselState = this.cloneCarouselState();
        if (carouselState.config.dragEnabled) {

            this.disableAutoplay(AutoplaySuspender.DRAG);
        }
    }

    /**
     * Update state to announce that drag sequence just ended
     * and perform necessary cleanups
     */
    dragEnd(passedDistance: number): void {
        this.enableAutoplay(AutoplaySuspender.DRAG);
        const carouselState = this.cloneCarouselState();

        // Normalize passed distance to current carousel width mode
        if (carouselState.config.widthMode === CarouselWidthMode.PERCENT) {
            passedDistance = 100 * passedDistance / carouselState.viewportWidthInPx;
        }

        const activeSlideResult = calculateActiveSlide(
            carouselState.slides,
            carouselState.offset,
            carouselState.config.alignMode,
            carouselState.config.slideWidth,
            carouselState.viewportWidth,
            Math.min(carouselState.config.slideWidth / 2, MAX_SWIPE_THRESHOLD),
            passedDistance,
        );
        this.setSlideIndex(activeSlideResult.slideIndex);
    }

    /**
     * @param offset delta value in pixel where new offset should be moved to
     */
    drag(fromX: number, toX: number): void {
        const carouselState = this.cloneCarouselState();
        if (!carouselState.config.dragEnabled || fromX === toX) {

            return;
        }
        const viewportWidth = carouselState.viewportWidth;
        let newOffset = carouselState.config.widthMode === CarouselWidthMode.PX
            ? carouselState.offset
            : carouselState.offset * 100 / viewportWidth; // Pixel value must be converted to percents
        let slides = carouselState.slides;
        if (carouselState.animation) {
            const position = new Date().getTime() - carouselState.animation.startTime;
            newOffset = animationOffsetSnapshot(
                position,
                carouselState.config.transitionDuration,
                carouselState.animation.from.offset,
                carouselState.animation.to.offset,
                carouselState.animationBezierFn,
            );
            this.destroyPlayerWithoutCallback(carouselState.animation.player);
            carouselState.animation = null;
        }
        newOffset = dragOffsetSnapshot(
            fromX,
            toX,
            newOffset,
            carouselState.config.widthMode,
            carouselState.config.alignMode,
            carouselState.config.shouldLoop,
            viewportWidth,
            carouselState.viewportWidthInPx,
            carouselState.config.slideWidth,
            carouselState.slides.length * carouselState.config.slideWidth,
            MAX_OVERSCROLL,
            carouselState.dragBezierFn,
            carouselState.invertedDragBezierFn,
        );
        slides = markVisibleAndActive(
            slides,
            newOffset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.activeSlideIndex,
        );
        const shuffleResult = shuffleSlides(
            slides,
            newOffset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.config.items,
            carouselState.config.shouldLoop,
            this.slideIdGenerator,
        );
        const activeSlideResult = calculateActiveSlide(
            shuffleResult.slides,
            shuffleResult.modifiedOffset,
            carouselState.config.alignMode,
            carouselState.config.slideWidth,
            viewportWidth,
        );
        slides = markVisibleAndActive(
            shuffleResult.slides,
            shuffleResult.modifiedOffset,
            carouselState.config.slideWidth,
            viewportWidth,
            activeSlideResult.slideIndex,
        );
        carouselState.slides = slides;
        carouselState.offset = shuffleResult.modifiedOffset;
        carouselState.activeSlideIndex = activeSlideResult.slideIndex;
        carouselState.activeItemIndex = slides[activeSlideResult.slideIndex].itemIndex;
        this.setCarouselState(carouselState);
    }

    setSlideTemplate(newTemplateRef: TemplateRef<any> | null): void {
        const carouselState = this.cloneCarouselState();
        carouselState.template = newTemplateRef;
        this.setCarouselState(carouselState);
    }

    disableAutoplay(suspender: AutoplaySuspender): void {
        const carouselState = this.cloneCarouselState();
        if (!carouselState.autoplay) {
            carouselState.autoplay = new CarouselAutoplay();
        }
        if (carouselState.autoplay.autoplaySubscription) {
            carouselState.autoplay.autoplaySubscription.unsubscribe();
        }
        if (!carouselState.autoplay.autoplaySuspenders) {
            carouselState.autoplay.autoplaySuspenders = new Set<AutoplaySuspender>();
        }
        carouselState.autoplay.autoplaySuspenders.add(suspender);
        this.setCarouselState(carouselState);
    }

    enableAutoplay(suspender: AutoplaySuspender = null): void {
        const carouselState = this.cloneCarouselState();
        if (!carouselState.autoplay) {
            carouselState.autoplay = new CarouselAutoplay();
        }
        if (carouselState.autoplay.autoplaySubscription) {
            carouselState.autoplay.autoplaySubscription.unsubscribe();
        }
        if (!carouselState.autoplay.autoplaySuspenders) {
            carouselState.autoplay.autoplaySuspenders = new Set<AutoplaySuspender>();
        }
        if (suspender !== null) {
            carouselState.autoplay.autoplaySuspenders.delete(suspender);
        }
        if (carouselState.config.autoplayEnabled && !carouselState.autoplay.autoplaySuspenders.size) {
            const intervalTime = Math.max(
                carouselState.config.transitionDuration,
                carouselState.config.autoplayDelay,
            );
            carouselState.autoplay.autoplaySubscription = this.autoplaySubscription(intervalTime);
        }
        this.setCarouselState(carouselState);
    }

    setContainers(widthContainer: HTMLElement, animatableContainer: HTMLElement): void {
        const carouselState = this.cloneCarouselState();
        carouselState.widthContainer = widthContainer;
        carouselState.animatableContainer = animatableContainer;
        carouselState.initializationState.viewportWidthInitialized = true;
        this.applyStateChange(carouselState);
    }

    setConfig(newConfig: CarouselConfig): void {
        const carouselState = this.cloneCarouselState();
        carouselState.config = newConfig;
        carouselState.initializationState.configInitialized = true;
        this.applyStateChange(carouselState);
    }

    private cloneCarouselState(): CarouselState {
        const clonedState = new CarouselState(this.carouselState$.getValue());
        return clonedState;
    }

    private setCarouselState(newState: CarouselState): void {
        this.carouselState$.next(newState);
    }

    /**
     * Narrow case scenario helper: use this when carousel inputs change.
     * Function task is to initialize carousel whether all the components
     * are ready.
     */
    private applyStateChange(newState: CarouselState): void {
        const currentState = this.cloneCarouselState();
        if (
            !newState.initializationState.configInitialized
            || !newState.initializationState.viewportWidthInitialized
        ) {
            this.setCarouselState(newState);

            return;
        }
        if (
            !newState.initializationState.firstInitalization
            || currentState.config.widthMode !== newState.config.widthMode
            || currentState.config.slideWidth !== newState.config.slideWidth
            || currentState.config.alignMode !== newState.config.alignMode
            || currentState.config.shouldLoop !== newState.config.shouldLoop
            || currentState.config.items !== newState.config.items
        ) {
            newState = this.initializeCarousel(newState);
        }
        this.setCarouselState(newState);
    }

    /**
     * Cleans current slides if present and creates them anew.
     */
    private initializeCarousel(carouselState: CarouselState): CarouselState {
        carouselState.initializationState.firstInitalization = true;
        let slides = initializeCarousel(carouselState.config.items, this.slideIdGenerator);
        const viewportWidth = carouselState.viewportWidth;
        const newOffset = calculateOffset(
            0,
            carouselState.config.alignMode,
            carouselState.config.slideWidth,
            viewportWidth,
            slides.length,
            carouselState.config.shouldLoop,
        );
        slides = markVisibleAndActive(
            slides,
            newOffset,
            carouselState.config.slideWidth,
            viewportWidth,
            0,
        );
        const shuffleResult = shuffleSlides(
            slides,
            newOffset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.config.items,
            carouselState.config.shouldLoop,
            this.slideIdGenerator,
        );
        if (carouselState.animation) {
            this.destroyPlayerWithoutCallback(carouselState.animation.player);
            carouselState.animation = null;
        }
        carouselState.autoplay = this.initializeAutoplay(carouselState);
        carouselState.slides = shuffleResult.slides;
        carouselState.offset = shuffleResult.modifiedOffset;
        const activeSlideIndex = this.getActiveSlideIndex(shuffleResult.slides);
        carouselState.activeSlideIndex = activeSlideIndex;
        carouselState.activeItemIndex = shuffleResult.slides[activeSlideIndex].itemIndex;
        carouselState.dragBezierFn = bezier(
            DRAG_BEZIER_ARGS[0],
            DRAG_BEZIER_ARGS[1],
            DRAG_BEZIER_ARGS[2],
            DRAG_BEZIER_ARGS[3],
        );
        carouselState.invertedDragBezierFn = bezier(
            1 - DRAG_BEZIER_ARGS[0],
            1 - DRAG_BEZIER_ARGS[1],
            1 - DRAG_BEZIER_ARGS[2],
            1 - DRAG_BEZIER_ARGS[3],
        );
        carouselState.animationBezierFn = bezier(
            ANIMATION_BEZIER_ARGS[0],
            ANIMATION_BEZIER_ARGS[1],
            ANIMATION_BEZIER_ARGS[2],
            ANIMATION_BEZIER_ARGS[3],
        );

        return carouselState;
    }

    private initializeAutoplay(carouselState: CarouselState): CarouselAutoplay {
        const autoplay = carouselState.autoplay || new CarouselAutoplay();
        if (autoplay.autoplaySubscription) {
            autoplay.autoplaySubscription.unsubscribe();
        }
        if (carouselState.config.autoplayEnabled && !autoplay.autoplaySuspenders.size) {
            const intervalTime = Math.max(
                carouselState.config.transitionDuration,
                carouselState.config.autoplayDelay,
            );
            autoplay.autoplaySubscription = this.autoplaySubscription(intervalTime);
        }

        return autoplay;
    }

    private setSlideIndex(newSlideIndex: number): void {
        const carouselState = this.cloneCarouselState();
        const viewportWidth = carouselState.viewportWidth;
        let currentOffset = carouselState.offset;
        let slides = carouselState.slides;
        if (carouselState.animation) {
            const position = new Date().getTime() - carouselState.animation.startTime;
            currentOffset = animationOffsetSnapshot(
                position,
                carouselState.config.transitionDuration,
                carouselState.animation.from.offset,
                carouselState.animation.to.offset,
                carouselState.animationBezierFn,
            );
            this.destroyPlayerWithoutCallback(carouselState.animation.player);
            carouselState.animation = null;
        }
        slides = markVisibleAndActive(
            slides,
            currentOffset,
            carouselState.config.slideWidth,
            viewportWidth,
            newSlideIndex,
        );
        const intermediateOffset = calculateOffset(
            newSlideIndex,
            carouselState.config.alignMode,
            carouselState.config.slideWidth,
            viewportWidth,
            slides.length,
            carouselState.config.shouldLoop,
        );
        const shuffleResult = shuffleSlides(
            slides,
            intermediateOffset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.config.items,
            carouselState.config.shouldLoop,
            this.slideIdGenerator,
        );
        const activeSlideIndex = this.getActiveSlideIndex(shuffleResult.slides);
        // If active slide changed, it means that shuffle broke our offset
        // and it should be justified for animation start point
        const justifiedOffset = newSlideIndex !== activeSlideIndex
            ? currentOffset - (activeSlideIndex - newSlideIndex) * carouselState.config.slideWidth
            : currentOffset;
        const offsetBefore = new Offset(justifiedOffset, carouselState.config.widthMode);
        const offsetAfter = new Offset(shuffleResult.modifiedOffset, carouselState.config.widthMode);
        carouselState.offset = shuffleResult.modifiedOffset;
        carouselState.animation = this.playAnimation(
            carouselState.animatableContainer,
            offsetBefore,
            offsetAfter,
            carouselState.config.transitionDuration,
        );
        carouselState.activeSlideIndex = activeSlideIndex;
        const activeSlide = shuffleResult.slides[activeSlideIndex];
        carouselState.activeItemIndex = activeSlide
            ? activeSlide.itemIndex
            : 0;
        carouselState.slides = shuffleResult.slides;
        this.setCarouselState(carouselState);
    }

    private cleanup(): void {
        const carouselState = this.cloneCarouselState();
        const viewportWidth = carouselState.viewportWidth;
        if (carouselState.animation) {
            this.destroyPlayerWithoutCallback(carouselState.animation.player);
            carouselState.animation = null;
        }
        this.currentAnimationId = null;
        carouselState.slides = markVisibleAndActive(
            carouselState.slides,
            carouselState.offset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.activeSlideIndex,
        );
        const activeSlideIndexBefore = this.getActiveSlideIndex(carouselState.slides);
        carouselState.slides = removeCopies(
            carouselState.slides,
            carouselState.offset,
            carouselState.config.slideWidth,
            viewportWidth,
            carouselState.config.items.length,
        );
        const activeSlideIndex = this.getActiveSlideIndex(carouselState.slides);
        carouselState.activeSlideIndex = activeSlideIndex;
        carouselState.activeItemIndex = carouselState.slides[activeSlideIndex].itemIndex;
        carouselState.offset -= (carouselState.activeSlideIndex - activeSlideIndexBefore) * carouselState.config.slideWidth;
        this.setCarouselState(carouselState);
    }

    /**
     * Stops animation, but doesn't triggers callback with cleanup.
     */
    private destroyPlayerWithoutCallback(player: AnimationPlayer): void {
        this.currentAnimationId = null; // Always comes before player finish/destroy
        try {
            player.finish();
            player.destroy();
        // Ignore exception since player might be already destroyed
        // at this moment
        } catch (e) {}
    }

    /**
     * Returns index of `isActive` slide or throws exception
     */
    private getActiveSlideIndex(slides: CarouselSlide[]): number {
        if (!slides || !slides.length) {

            return 0;
        }
        const activeSlideIndex = slides
            .findIndex((slide: CarouselSlide) => slide.options.isActive);
        if (activeSlideIndex === -1) {

            throw new CarouselError('Failed to find active slide index');
        }

        return activeSlideIndex;
    }

    /**
     * Creates new transition animation with corresponding done callbacks
     * and plays it
     */
    private playAnimation(
        container: HTMLElement,
        from: Offset,
        to: Offset,
        duration: number,
    ): CarouselAnimation {
        const bezierArgs = ANIMATION_BEZIER_ARGS;
        const cubicBezier = `cubic-bezier(${bezierArgs[0]},${bezierArgs[1]},${bezierArgs[2]},${bezierArgs[3]})`;
        const animationFactory = this.animation.build([
            style({
                transform: `translateX(${from.offset}${from.mode})`,
            }),
            animate(`${duration}ms ${cubicBezier}`, style({
                transform: `translateX(${to.offset}${to.mode})`,
            })),
        ]);
        const animationPlayer = animationFactory.create(container);
        const animation = new CarouselAnimation(
            this.animationIdGenerator.next(),
            from,
            to,
            animationPlayer,
        );
        animationPlayer.onDone(() => {
            if (this.currentAnimationId !== null && this.currentAnimationId === animation.id) {
                animationPlayer.destroy();
                this.cleanup();
            }
        });
        animationPlayer.play();
        this.currentAnimationId = animation.id;

        return animation;
    }

    private autoplaySubscription(intervalTime: number): Subscription {
        return interval(intervalTime)
            .pipe(
                takeUntil(this.destroyed$),
            )
            .subscribe(() => this.next(true));
    }
}
