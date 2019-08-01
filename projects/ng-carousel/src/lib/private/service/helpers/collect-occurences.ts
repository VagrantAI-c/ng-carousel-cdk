import { CarouselSlideOccurence } from '../../models/carousel-slide-occurence';
import { CarouselSlide } from '../../models/carousel-slide';
import { CarouselError } from '../../models/carousel-error';

/**
 * Returns map of item indexes as keys and occurences as value.
 * Throws error if current slides has gaps in their item index
 * sequence.
 *
 * Occurence is an object of slide indexes with notice whether
 * slide is in viewport or not.
 */
export function collectOccurences(
    slides: CarouselSlide[],
    offset: number,
    slideWidth: number,
    viewportWidth: number,
    itemsLength: number,
): Map<number, CarouselSlideOccurence> {
    const slideOccurenceMap = new Map<number, CarouselSlideOccurence>();
    let lastSlideItemIndex = null;
    for (let i = 0, currentOffset = offset; i < slides.length; i++, currentOffset += slideWidth) {
        try {
            lastSlideItemIndex = assertSequence(slides[i].itemIndex, lastSlideItemIndex, itemsLength);
        } catch (error) {
            console.error('Virtual carousel debug information:', slides);

            throw error;
        }

        const slideOccurence = slideOccurenceMap.get(slides[i].itemIndex) || new CarouselSlideOccurence();
        slides[i].options.inViewport = currentOffset < viewportWidth && currentOffset + slideWidth > 0;
        slides[i].options.inViewport
            ? slideOccurence.unremovableSlideIndexes.push(i)
            : slideOccurence.removableSlideIndexes.push(i);
        slideOccurenceMap.set(slides[i].itemIndex, slideOccurence);
    }

    return slideOccurenceMap;
}

/**
 * Throws error whether slide sequence chunk is incorrect.
 *
 * Since all slides for parent function should not have
 * item index gaps, all item indexes should go incrementally,
 * e.g. with given itemsLength = 3, [0, 1, 2, 0, 1, 2, 0] is correct
 * item index sequence and [0, 1, 0, 1, 2] is incorrect.
 * However slide row might not be looped, so [0, 1, 2, 0] is correct
 * item index sequence too.
 *
 * This functions checks single chunk of this sequence, not
 * the whole sequence.
 * @returns slideItemIndex
 */
export function assertSequence(
    slideItemIndex: number,
    lastSlideItemIndex: number,
    itemsLength: number,
): number {
    if (lastSlideItemIndex === null) {

        return slideItemIndex;
    }

    if (
        slideItemIndex === lastSlideItemIndex + 1
        || (slideItemIndex === 0 && lastSlideItemIndex === itemsLength - 1)
    ) {

        return slideItemIndex;
    }

    throw new CarouselError('Slides have incorrect sequence');
}
