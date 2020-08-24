import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { CalculateOffsetResult } from './models/calculate-offset-result';

/**
 * Calculates offset by specified arguments as if current slide was centered
 */
export function calculateOffset(
    currentSlideIndex: number,
    alignMode: CarouselAlignMode,
    slideWidth: number,
    viewportWidth: number,
    slideQuantity: number,
    shouldLoop: boolean,
): CalculateOffsetResult {
    const activeSlideLeftPosition = alignMode === CarouselAlignMode.CENTER
        ? (viewportWidth - slideWidth) / 2
        : 0;
    const slidesSumWidth = slideWidth * slideQuantity;
    let newOffset =  activeSlideLeftPosition - (slideWidth * currentSlideIndex);

    // Edge case amendment for left-aligned non-looped slides:
    // non-looped slides might have their right or left edge visible
    // so we might amend offset for some situations
    if (!shouldLoop && alignMode === CarouselAlignMode.LEFT) {
        // Calculate prequesites
        const rightmostPoint = newOffset + slidesSumWidth;
        const allSlidesVisible = slidesSumWidth <= viewportWidth;

        // Apply offset amendment
        if (!allSlidesVisible && rightmostPoint <= viewportWidth) {
            // Left aligned slides with their right edge visible:
            // righmost slide edge should stick to the right viewport edge
            newOffset = viewportWidth - slidesSumWidth;
        } else if (allSlidesVisible) {
            // Left aligned slides which are all visible:
            // just stick them to the left viewport edge
            newOffset = 0;
        }
    }
    const result = new CalculateOffsetResult(Math.round(newOffset));

    return result;
}
