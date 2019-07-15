import { CarouselSlide } from '../../models/carousel-slide';
import { collectOccurences } from './collect-occurences';

/**
 * Remove all slides marked with copies leaving
 * at least one slide with unique item index in carousel
 */
export function removeCopies(
    slides: CarouselSlide[],
    offset: number,
    slideWidth: number,
    viewportWidth: number,
    itemsLength: number,
): CarouselSlide[] {
    if (!slides || !slides.length) {

        return [];
    }
    const newSlideIndexSet = new Set<number>();

    // Step 1: construct map of overall occurences
    const slideQuantityMap = collectOccurences(
        slides,
        offset,
        slideWidth,
        viewportWidth,
        itemsLength,
    );

    // Step 2: construct array of new slides indexes
    // Result is set of indexes which should moved from slides array
    // to output slide array
    const slideOccurences = Array.from(slideQuantityMap.values());
    for (const slideOccurence of slideOccurences) {
        if (slideOccurence.unremovableSlideIndexes.length) {
            for (const index of slideOccurence.unremovableSlideIndexes) {
                newSlideIndexSet.add(index);
            }
        } else if (slideOccurence.removableSlideIndexes.length) {
            newSlideIndexSet.add(slideOccurence.removableSlideIndexes[0]);
        }
    }

    // Step 3: construct array of new slides based on constructed index set
    const newSlideIndexes = Array.from(newSlideIndexSet.values())
        .sort((a: number, b: number) => a - b);
    const newSlides: CarouselSlide[] = [];
    for (const index of newSlideIndexes) {
        newSlides.push(slides[index]);
    }

    return newSlides;
}
