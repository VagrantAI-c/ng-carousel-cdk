import { CarouselWidthMode } from './carousel-width-mode';
import { CarouselAlignMode } from './carousel-align-mode';

export class CarouselConfig<T = any> {
    /**
     * Array of data to display
     */
    items: T[] = [];
    /**
     * Describes how carousel calculates its content width.
     * Consult with corresponding enum to see what options
     * are available.
     */
    widthMode: CarouselWidthMode = CarouselWidthMode.PERCENT;
    /**
     * Slide width. It could be pixels or percents, based on mode
     * configuration.
     */
    slideWidth = 100;
    /**
     * Describes how slides should be positioned relative to
     * carousel viewport
     */
    alignMode: CarouselAlignMode = CarouselAlignMode.CENTER;
    /**
     * Whether autoplay is enabled
     */
    autoplayEnabled = true;
    /**
     * Time in ms of how long carousel would wait until automatic
     * slide increment. Respects `autoplayEnabled` value.
     */
    autoplayDelay = 6000;
    /**
     * Whether mouse drag or gesture panning enabled
     */
    dragEnabled = true;
    /**
     * Whether carousel should start from beginning after last
     * slide
     */
    shouldLoop = true;
    /**
     * Time in ms of how long transition between slides would last
     */
    transitionDuration = 280;
    /**
     * Whether carousel should automatically recalculate on window resize.
     * This option is recommended when using pixel width mode or left
     * alignment.
     */
    shouldRecalculateOnResize = true;
    /**
     * Value in current width mode units which are virtally added to both sides
     * of viewport. Slides within this virtual zone should always be presented
     * whether loop mode is on.
     */
    threshold = 5;

    constructor(config?: Partial<CarouselConfig<T>>) {
        this.items = config?.items ?? [];
        this.widthMode = config?.widthMode ?? CarouselWidthMode.PERCENT;
        this.alignMode = config?.alignMode ?? CarouselAlignMode.CENTER;
        this.slideWidth = typeof config?.slideWidth === 'number'
            ? config.slideWidth
            : 100;
        this.autoplayEnabled = typeof config?.autoplayEnabled === 'boolean'
            ? config.autoplayEnabled
            : true;
        this.autoplayDelay = typeof config?.autoplayDelay === 'number'
            ? config.autoplayDelay
            : 6000;
        this.dragEnabled = typeof config?.dragEnabled === 'boolean'
            ? config.dragEnabled
            : true;
        this.shouldLoop = typeof config?.shouldLoop === 'boolean'
            ? config.shouldLoop
            : true;
        this.transitionDuration = typeof config?.transitionDuration === 'number'
            ? config.transitionDuration
            : 600;
        this.shouldRecalculateOnResize = typeof config?.shouldRecalculateOnResize === 'boolean'
            ? config.shouldRecalculateOnResize
            : true;
    }
}
