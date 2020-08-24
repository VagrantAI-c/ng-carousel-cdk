import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { CarouselSlide } from '../../../models/carousel-slide';
import { CalculateActiveSlideResult } from './models/calculate-active-slide-result';

/**
 * Based on current whereabouts, returns most possible
 * active slide candidate and proposed offset for it
 */
export function calculateActiveSlide(
    slides: CarouselSlide[],
    offset: number,
    alignMode: CarouselAlignMode,
    slideWidth: number,
    viewportWidth: number,
    swipeThresholdPercent: number | null,
    /** Distance (whether in px or %) that is aligned to carousel width mode */
    swipeDistance: number | null = null,
): CalculateActiveSlideResult {
    const result = new CalculateActiveSlideResult(offset, 0);

    // Noop run if nothing to calculate
    if (!slides.length || slideWidth <= 0) {

        return result;
    }
    const slidesSumWidth = slideWidth * slides.length;

    // By given align mode, width mode and viewport width, calculate
    // carousel center position
    const carouselCenter = alignMode === CarouselAlignMode.LEFT
        ? 0
        : viewportWidth / 2;

    // Slide center is not always its left side. On such occasion we should
    // correct its offset using specified align mode.
    const slideRightAmendment = alignMode === CarouselAlignMode.LEFT
        ? slideWidth
        : slideWidth / 2;
    const slideLeftAmendment = alignMode === CarouselAlignMode.LEFT
        ? 0
        : slideRightAmendment;

    // Preset if slides far behind carousel center
    if (offset + slidesSumWidth < carouselCenter) {
        result.slideIndex = slides.length - 1;
        result.modifiedOffset = carouselCenter - slidesSumWidth + slideRightAmendment;

    // Preset if slides far away from carousel center
    } else if (offset - slideLeftAmendment > carouselCenter) {
        result.slideIndex = 0;
        result.modifiedOffset = carouselCenter - slideLeftAmendment;

    // Any other cases (when slides intersect carousel center)
    } else {
        result.slideIndex = Math.floor(Math.abs(carouselCenter - offset) / slideWidth);
        result.modifiedOffset = carouselCenter - result.slideIndex * slideWidth - slideLeftAmendment;
    }

    // Swipe correction: animation must align with swipe direction meaning
    // when user swipes right, final animation should also lead to the right
    const swipeDirection = Math.sign(swipeDistance);
    const offsetDirection = offset > result.modifiedOffset
        ? -1
        : 1;
    const shouldApplySwipeAlignment =
        swipeDistance !== null
        && swipeThresholdPercent !== null
        && Math.abs(swipeDistance) > Math.abs(swipeThresholdPercent)
        && swipeDirection !== offsetDirection;
    if (shouldApplySwipeAlignment) {
        const appliedSwipeAlignment = result.slideIndex - swipeDirection;
        const newSlideIndex = Math.min(Math.max(0, appliedSwipeAlignment), slides.length - 1);
        if (newSlideIndex !== result.slideIndex) {
            result.slideIndex = newSlideIndex;
            result.modifiedOffset += swipeDirection * slideWidth;
        }
    }

    return result;
}
