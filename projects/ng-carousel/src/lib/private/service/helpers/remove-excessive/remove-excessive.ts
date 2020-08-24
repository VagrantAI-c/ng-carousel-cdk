import { CarouselSlide } from '../../../models/carousel-slide';
import { RemoveExcessiveResult } from './models/remove-excessive-result';

/**
 * Removes slides that should not exist in carousel
 * (e.g. copies which are outside viewport)
 */
export function removeExcessive(
    slides: CarouselSlide[],
    offset: number,
    slideWidth: number,
    /** First slide index that is inside viewport */
    viewportStart: number,
    /** Last slide index that is inside viewport */
    viewportEnd: number,
): RemoveExcessiveResult {
    if (!slides || !slides.length) {

        return new RemoveExcessiveResult([], offset);
    }
    // Validate inputs
    viewportStart = Math.max(0, Math.min(viewportStart, viewportEnd));
    viewportEnd = Math.min(viewportStart, slides.length - 1);

    const rightSlides: CarouselSlide[] = [];
    const leftSlides: CarouselSlide[] = [];
    const itemIndexes = new Set<number>();
    let newOffset = offset;
    // Next fancy loop traverses through slides array, but in specified order:
    // first we travel through slides in viewport, so we can collect item ids,
    // next we go through right and left side outside viewport, cleaning all
    // found copies. Thus we can cleanse all copies in O(n)
    for (let i = viewportStart; i <= viewportEnd; i++) {
        itemIndexes.add(slides[i].itemIndex);
        rightSlides.push(slides[i]);
    }
    for (let i = viewportEnd + 1; i < slides.length; i++) {
        if (itemIndexes.has(slides[i].itemIndex)) {
            continue;
        }
        itemIndexes.add(slides[i].itemIndex);
        rightSlides.push(slides[i]);
    }
    for (let i = 0; i < viewportStart; i++) {
        if (itemIndexes.has(slides[i].itemIndex)) {
            newOffset += slideWidth;
            continue;
        }
        itemIndexes.add(slides[i].itemIndex);
        leftSlides.push(slides[i]);
    }

    const newSlides = [
        ...leftSlides,
        ...rightSlides,
    ];

    return new RemoveExcessiveResult(newSlides, newOffset);
}
