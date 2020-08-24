import { TemplateRef } from '@angular/core';
import { EasingFunction } from 'bezier-easing';

import { CarouselConfig } from '../../carousel-config';
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
    /**
     * Container to measure gallery width. Type is HTMLElement but
     * reduced for the ease of testing.
     */
    widthContainer: {offsetWidth: number} | null = null;
    /** Container that should be animated during index change */
    animatableContainer: HTMLElement | null = null;
    /** Client-side config which regulates carousel behavior */
    config: CarouselConfig = new CarouselConfig();
    activeSlideIndex = 0;
    /** Item index of config's items array */
    activeItemIndex = 0;
    template: TemplateRef<any> | null = null;
    /** X position of leftmost carousel slide */
    offset = 0;
    slides: CarouselSlide[] = [];
    /** State of multiphase initialization */
    initializationState = new InitializationState();
    /** Currently played animation */
    animation: CarouselAnimation | null = null;
    autoplay: CarouselAutoplay = new CarouselAutoplay();
    dragBezierFn: EasingFunction;
    /** Used to extract values to applied beziers */
    invertedDragBezierFn: EasingFunction;
    animationBezierFn: EasingFunction;
    /**
     * When no slides available and user intents to set index,
     * this field would be initialized with desired index, which
     * should be to activeSlideIndex when slides become available
     */
    postponedItemIndex: number;
    /** Whether drag is in process right now */
    isDragged: boolean;

    constructor(state?: CarouselState) {
        if (state) {
            Object.assign(this, state);
        }
    }
}
