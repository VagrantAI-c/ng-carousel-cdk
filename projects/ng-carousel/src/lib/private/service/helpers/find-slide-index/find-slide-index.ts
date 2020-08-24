import { CarouselSlide } from '../../../models/carousel-slide';
import { IterateSideResult } from './models/iterate-side-result';

/**
 * Finds slide that is marked as `isActive` and returns its index
 */
export function findSlideIndex(
    slides: CarouselSlide[],
    newItemIndex: number,
    currentSlideIndex: number,
): number {
    if (!slides) {

        return 0;
    }
    const currentActiveSlide = slides[currentSlideIndex];
    if (!currentActiveSlide) {

        return 0;
    }
    const currentItemIndex = currentActiveSlide.itemIndex;
    let targetSlideIndex: IterateSideResult | null = null;
    if (newItemIndex === currentItemIndex || slides.length <= 1) {

        return currentSlideIndex;
    } else if (newItemIndex > currentItemIndex) {
        targetSlideIndex =
            iterateRightSide(slides, newItemIndex, currentSlideIndex)
            || iterateLeftSide(slides, newItemIndex, currentSlideIndex);
    } else {
        targetSlideIndex =
            iterateLeftSide(slides, newItemIndex, currentSlideIndex)
            || iterateRightSide(slides, newItemIndex, currentSlideIndex);
    }

    return targetSlideIndex?.foundIndex ?? null;
}

function iterateRightSide(
    slides: CarouselSlide[],
    newItemIndex: number,
    currentSlideIndex: number,
): IterateSideResult | null {
    for (let i = currentSlideIndex + 1; i < slides.length; i++) {
        if (slides[i].itemIndex === newItemIndex) {

            return {foundIndex: i};
        }
    }

    return null;
}

function iterateLeftSide(
    slides: CarouselSlide[],
    newItemIndex: number,
    currentSlideIndex: number,
): IterateSideResult | null {
    for (let i = currentSlideIndex - 1; i >= 0; i--) {
        if (slides[i].itemIndex === newItemIndex) {

            return {foundIndex: i};
        }
    }

    return null;
}
