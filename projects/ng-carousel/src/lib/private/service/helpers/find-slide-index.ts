import { CarouselSlide } from '../../models/carousel-slide';
import { CarouselError } from '../../models/carousel-error';
import { IterateSideResult } from '../../models/iterate-side-result';

/**
 * Finds slide that is marked as `isActive` and returns its index.
 * Throws error whether such slide was not found.
 */
export function findSlideIndex(
    slides: CarouselSlide[],
    newItemIndex: number,
    currentSlideIndex: number,
): number {
    const currentItemIndex = slides[currentSlideIndex].itemIndex;
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

    if (targetSlideIndex) {

        return targetSlideIndex.foundIndex;
    } else {
        console.error('Virtual carousel debug information:', slides);

        throw new CarouselError(`Slide with item index ${newItemIndex} was not found`);
    }
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
