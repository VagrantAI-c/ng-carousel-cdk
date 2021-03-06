import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { CarouselSlide } from '../../../models/carousel-slide';
import { CarouselSlideParams } from '../../../models/carousel-slide-params';
import { MarkVisibleAndActiveResult } from './models/mark-visible-and-active-result';

/**
 * Returns cloned slides with modified `inViewport` and `isActive` fields
 */
export function markVisibleAndActive(
    slides: CarouselSlide[],
    offset: number,
    slideWidth: number,
    viewportWidth: number,
    activeSlideIndex: number,
    threshold: number,
    alignMode: CarouselAlignMode,
): MarkVisibleAndActiveResult {
    if (!slides || !slides.length) {

        return new MarkVisibleAndActiveResult([], 0, 0);
    }

    const newSlides: CarouselSlide[] = [];
    /** Slide index representing first slide inside viewport */
    let inViewportStart: number | null = null;
    /** Slide index representing last slide inside viewport */
    let inViewportEnd: number | null = null;
    for (let i = 0, currentOffset = offset; i < slides.length; i++, currentOffset += slideWidth) {
        // Calculate slide options
        const slideBeforeViewportEnd = currentOffset < viewportWidth + threshold;
        const slideAfterViewportStart = currentOffset + slideWidth + threshold > 0;
        const inViewport = slideBeforeViewportEnd && slideAfterViewportStart;
        const options: Partial<CarouselSlideParams> = {
            inViewport,
            isActive: i === activeSlideIndex,
        };

        // Construct new slide
        const newSlide = new CarouselSlide(
            slides[i].id,
            slides[i].itemIndex,
            Object.assign({}, slides[i].options, options),
        );
        newSlides.push(newSlide);

        // Detect viewport range
        if (inViewport && inViewportStart === null) {
            inViewportStart = i;
        } else if (!inViewport && inViewportStart !== null && inViewportEnd === null) {
            inViewportEnd = Math.max(0, i - 1);
        }
    }

    // Edge case when last slide was in viewport:
    // in such case viewport end index won't be assigned
    // inside slide cycle due to loop algorithm specifics
    if (inViewportStart !== null && inViewportEnd === null) {
        inViewportEnd = slides.length - 1;
    }

    if (activeSlideIndex >= 0 && activeSlideIndex <= slides.length - 1) { // Active slide might be outside slide range
        if (inViewportStart === null || activeSlideIndex <= inViewportStart) {
            const distanceToActiveSlideViewportStart = alignMode === CarouselAlignMode.LEFT
                ? threshold
                : viewportWidth / 2 - slideWidth / 2 + threshold;
            const slidesToViewportStart = Math.ceil(distanceToActiveSlideViewportStart / slideWidth);
            inViewportStart = Math.max(0, activeSlideIndex - slidesToViewportStart);
        }
        if (inViewportEnd === null || activeSlideIndex >= inViewportEnd) {
            const distanceToActiveSlideViewportEnd = alignMode === CarouselAlignMode.LEFT
                ? viewportWidth + threshold
                : viewportWidth / 2 + slideWidth / 2 + threshold;
            const slidesToViewportEnd = Math.ceil(distanceToActiveSlideViewportEnd / slideWidth);
            inViewportEnd = Math.min(slides.length - 1, activeSlideIndex + slidesToViewportEnd);
        }
    }

    const result = new MarkVisibleAndActiveResult(newSlides, inViewportStart || 0, inViewportEnd || 0);

    return result;
}
