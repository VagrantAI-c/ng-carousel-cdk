import { CarouselAlignMode } from '../../carousel-align-mode';
import { CarouselConfig } from '../../carousel-config.type';
import { CarouselWidthMode } from '../../carousel-width-mode';

export class CompleteCarouselConfig<T = any> {
    /**
     * Array of data to display
     *
     * Default: []
     */
    items: T[] = [];
    /**
     * Describes how carousel calculates its content width.
     * Consult with corresponding enum to see what options
     * are available.
     *
     * Default: CarouselWidthMode.PERCENT
     */
    widthMode: CarouselWidthMode = CarouselWidthMode.PERCENT;
    /**
     * Slide width. It could be pixels or percents, based on mode
     * configuration.
     *
     * Default: 100
     */
    slideWidth = 100;
    /**
     * Describes how slides should be positioned relative to
     * carousel viewport
     *
     * Default: CarouselAlignMode.CENTER
     */
    alignMode: CarouselAlignMode = CarouselAlignMode.CENTER;
    /**
     * Whether autoplay is enabled
     *
     * Default: true
     */
    autoplayEnabled = true;
    /**
     * Time in ms of how long carousel would wait until automatic
     * slide increment. Respects `autoplayEnabled` value.
     *
     * Default: 6000
     */
    autoplayDelay = 6000;
    /**
     * Whether mouse drag or gesture panning enabled
     *
     * Default: true
     */
    dragEnabled = true;
    /**
     * Whether carousel should start from beginning after last
     * slide
     *
     * Default: true
     */
    shouldLoop = true;
    /**
     * Time in ms of how long transition between slides would last
     *
     * Default: 280
     */
    transitionDuration = 280;
    /**
     * Whether carousel should automatically recalculate on window resize.
     * This option is recommended when using pixel width mode or left
     * alignment.
     *
     * Default: true
     */
    shouldRecalculateOnResize = true;
    /**
     * Specifies time for which carousel would wait after resize event
     * to recalculate its positions. 0 means no debounce is applied.
     *
     * Default: 300
     */
    recalculateDebounce = 300;
    /**
     * Value in current width mode units which are virtally added to both sides
     * of viewport. Slides within this virtual zone should always be presented
     * whether loop mode is on.
     *
     * Default: 5
     */
    threshold = 5;

    constructor(config?: CarouselConfig<T>) {
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
        this.recalculateDebounce = typeof config?.recalculateDebounce === 'number'
            ? config.recalculateDebounce
            : 300;
    }
}
