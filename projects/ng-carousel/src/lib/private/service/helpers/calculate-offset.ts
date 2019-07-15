import { CarouselAlignMode } from '../../../carousel-align-mode';

/**
 * Calculates offset by specified arguments as if active slide was centered
 */
export function calculateOffset(
    currentSlideIndex: number,
    alignMode: CarouselAlignMode,
    slideWidth: number,
    viewportWidth: number,
    slidesLength: number,
    shouldLoop: boolean,
): number {
    const activeSlideLeftPosition = alignMode === CarouselAlignMode.CENTER
        ? (viewportWidth - slideWidth) / 2
        : 0;
    let newOffset =  activeSlideLeftPosition - (slideWidth * currentSlideIndex);

    // Decide whether we should contain newly calculated offset
    // or should stick to viewport side
    if (!shouldLoop && alignMode === CarouselAlignMode.LEFT) {
        const slidesSumWidth = slideWidth * slidesLength;
        const rightmostPoint = newOffset + slidesSumWidth;
        const slidesSumWidthWiderThanViewport = slidesSumWidth >= viewportWidth;
        if (slidesSumWidthWiderThanViewport && rightmostPoint < viewportWidth) {
            newOffset = viewportWidth - slidesSumWidth;
        } else if (!slidesSumWidthWiderThanViewport) {
            newOffset = 0;
        }
    }

    return newOffset;
}
