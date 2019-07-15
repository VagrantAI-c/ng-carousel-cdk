import { TemplateRef } from '@angular/core';
import { EasingFunction } from 'bezier-easing';

import { CarouselConfig } from '../../carousel-config';
import { CarouselWidthMode } from '../../carousel-width-mode';
import { CarouselAnimation } from './carousel-animation';
import { CarouselAutoplay } from './carousel-autoplay';
import { CarouselSlide } from './carousel-slide';
import { InitializationState } from './initialization-state';

/**
 * Carousel state snapshot. Config is stored here
 * as well as other vital values like offset or
 * active slide index.
 */
export class CarouselState {
    /** Container to measure gallery width */
    widthContainer: HTMLElement | null = null;
    /** Container that should be animated during index change */
    animatableContainer: HTMLElement | null = null;
    config: CarouselConfig = new CarouselConfig();
    activeSlideIndex = 0;
    activeItemIndex = 0;
    template: TemplateRef<any> | null = null;
    offset = 0;
    slides: CarouselSlide[] = [];
    initializationState = new InitializationState();
    animation: CarouselAnimation | null = null;
    autoplay: CarouselAutoplay = new CarouselAutoplay();
    dragBezierFn: EasingFunction;
    /** Used to extract values to applied beziers */
    invertedDragBezierFn: EasingFunction;
    animationBezierFn: EasingFunction;
    // When adding a property, don't forget to add it in constructor

    /**
     * Width of carousel element in current width mode.
     * Try to call this as little as possible, since getting this value
     * triggers layout thrashing.
     */
    get viewportWidth(): number {
        return this.widthContainer
                && this.config
                && this.config.widthMode === CarouselWidthMode.PX
            ? this.viewportWidthInPx
            : 100;
    }

    /**
     * Width of carousel element in pixes. Try to call this as little as
     * possible, since getting this value triggers layout thrashing.
     */
    get viewportWidthInPx(): number {
        return this.widthContainer.offsetWidth;
    }

    constructor(state?: CarouselState) {
        if (!state) {

            return;
        }
        this.widthContainer = state.widthContainer;
        this.animatableContainer = state.animatableContainer;
        this.config = state.config;
        this.activeSlideIndex = state.activeSlideIndex;
        this.activeItemIndex = state.activeItemIndex;
        this.template = state.template;
        this.offset = state.offset;
        this.slides = state.slides;
        this.initializationState = state.initializationState;
        this.animation = state.animation;
        this.autoplay = state.autoplay;
        this.dragBezierFn = state.dragBezierFn;
        this.invertedDragBezierFn = state.invertedDragBezierFn;
        this.animationBezierFn = state.animationBezierFn;
    }
}
