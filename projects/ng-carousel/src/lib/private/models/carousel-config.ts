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
    /**
     * Whether carousel is listening to arrow keypresses and navigates to prev and
     * next slide accordingly after left or right arrow key is pressed
     */
    allowKeyboardNavigation = true;

    constructor(config?: CarouselConfig<T> | null) {
        this.items = [...(config?.items ?? [])];
        this.widthMode = config?.widthMode ?? CarouselWidthMode.PERCENT;
        this.alignMode = config?.alignMode ?? CarouselAlignMode.CENTER;
        this.slideWidth = extractCoerced(config?.slideWidth, 100);
        this.autoplayEnabled = extractCoerced(config?.autoplayEnabled, true);
        this.autoplayDelay = extractCoerced(config?.autoplayDelay, 6000);
        this.dragEnabled = extractCoerced(config?.dragEnabled, true);
        this.shouldLoop = extractCoerced(config?.shouldLoop, true);
        this.transitionDuration = extractCoerced(config?.transitionDuration, 600);
        this.shouldRecalculateOnResize = extractCoerced(config?.shouldRecalculateOnResize, true);
        this.recalculateDebounce = extractCoerced(config?.recalculateDebounce, 300);
        this.allowKeyboardNavigation = extractCoerced(config?.allowKeyboardNavigation, true);
    }
}

function extractCoerced<T>(value: T | null | undefined, defaultValue: T): T {
    if (isBoolean(defaultValue)) {

        return isBoolean(value) ? value : defaultValue;
    } else if (isNumber(defaultValue)) {

        return isNumber(value) ? value : defaultValue;
    }

    return value ?? defaultValue;
}

function isBoolean(prop?: any): prop is boolean {
    return typeof prop === 'boolean';
}

function isNumber(prop?: any): prop is number {
    return isFinite(prop) && !isNaN(prop);
}
