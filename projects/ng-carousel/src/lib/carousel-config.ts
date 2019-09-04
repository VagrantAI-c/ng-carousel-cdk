import { CarouselWidthMode } from './carousel-width-mode';
import { CarouselAlignMode } from './carousel-align-mode';

export class CarouselConfig {
    /**
     * Array of data to display
     */
    items?: any[] = [];
    /**
     * Describes how carousel calculates its content width.
     * Consult with corresponding enum to see what options
     * are available.
     */
    widthMode?: CarouselWidthMode = CarouselWidthMode.PERCENT;
    /**
     * Slide width. It could be pixels or percents, based on mode
     * configuration.
     */
    slideWidth ? = 100;
    /**
     * Describes how slides should be positioned relative to
     * carousel viewport
     */
    alignMode?: CarouselAlignMode = CarouselAlignMode.CENTER;
    /**
     * Whether autoplay is enabled
     */
    autoplayEnabled ? = true;
    /**
     * Time in ms of how long carousel would wait until automatic
     * slide increment. Respects `autoplayEnabled` value.
     */
    autoplayDelay ? = 6000;
    /**
     * Wheter mouse drag or gesture panning enabled
     */
    dragEnabled ? = true;
    /**
     * Whether carousel should start from beginning after last
     * slide
     */
    shouldLoop ? = true;
    /**
     * Time in ms of how long transition between slides would last
     */
    transitionDuration ? = 280;
    /**
     * Whether carousel should automatically recalculate on window resize.
     * This option is recommended when using pixel width mode or left
     * alignment.
     */
    shouldRecalculateOnResize ? = true;

    constructor(config?: CarouselConfig) {
        this.items = config && config.items || [];
        this.widthMode = config && config.widthMode || CarouselWidthMode.PERCENT;
        this.alignMode = config && config.alignMode || CarouselAlignMode.CENTER;
        this.slideWidth = config && typeof config.slideWidth === 'number'
            ? config.slideWidth
            : 100;
        this.autoplayEnabled = config && typeof config.autoplayEnabled === 'boolean'
            ? config.autoplayEnabled
            : true;
        this.autoplayDelay = config && typeof config.autoplayDelay === 'number'
            ? config.autoplayDelay
            : 6000;
        this.dragEnabled = config && typeof config.dragEnabled === 'boolean'
            ? config.dragEnabled
            : true;
        this.shouldLoop = config && typeof config.shouldLoop === 'boolean'
            ? config.shouldLoop
            : true;
        this.transitionDuration = config && typeof config.transitionDuration === 'number'
            ? config.transitionDuration
            : 600;
        this.shouldRecalculateOnResize = config && typeof config.shouldRecalculateOnResize === 'boolean'
            ? config.shouldRecalculateOnResize
            : true;
    }
}
