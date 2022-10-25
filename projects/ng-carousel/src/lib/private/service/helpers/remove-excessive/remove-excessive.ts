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
    activeSlideIndex: number,
    /** First slide index that is inside viewport */
    viewportStart: number | null,
    /** Last slide index that is inside viewport */
    viewportEnd: number | null,
): RemoveExcessiveResult {
    if (!slides || !slides.length || viewportStart === null || viewportEnd === null) {

        return new RemoveExcessiveResult([], offset, 0, 0, false);
    }
    // Validate inputs
    viewportStart = Math.max(0, Math.min(viewportStart, viewportEnd));
    viewportEnd = Math.min(viewportEnd, slides.length - 1);

    const rightSlides: CarouselSlide[] = [];
    const leftSlides: CarouselSlide[] = [];
    const itemIndexes = new Set<number>();
    let newOffset = offset;
    // Next fields should help us to detect new slide index
    let leftActiveSlideIndex = -1;
    let rightActiveSlideIndex = -1;
    let removedSlidesFromLeftSide = 0;
    let removedSlidesFromRightSide = 0;
    // Next fancy loop traverses through slides array, but in specified order:
    // first we travel through slides in viewport, so we can collect item ids,
    // next we go through right and left side outside viewport, cleaning all
    // found copies. Thus we can cleanse all copies in O(n)
    for (let i = viewportStart; i <= viewportEnd; i++) { // viewport traverse
        itemIndexes.add(slides[i].itemIndex);
        rightSlides.push(slides[i]);
        if (slides[i].options.isActive) {
            rightActiveSlideIndex = rightSlides.length - 1;
        }
    }
    for (let i = viewportEnd + 1; i < slides.length; i++) { // right side traverse
        if (itemIndexes.has(slides[i].itemIndex)) {
            removedSlidesFromRightSide++;
            continue;
        }
        itemIndexes.add(slides[i].itemIndex);
        rightSlides.push(slides[i]);
        if (slides[i].options.isActive) {
            rightActiveSlideIndex = rightSlides.length - 1;
        }
    }
    for (let i = 0; i < viewportStart; i++) { // left side traverse
        if (itemIndexes.has(slides[i].itemIndex)) {
            newOffset += slideWidth;
            removedSlidesFromLeftSide++;
            continue;
        }
        itemIndexes.add(slides[i].itemIndex);
        leftSlides.push(slides[i]);
        if (slides[i].options.isActive) {
            leftActiveSlideIndex = i;
        }
    }

    if (rightActiveSlideIndex !== -1) {
        activeSlideIndex = rightActiveSlideIndex + leftSlides.length;
    }

    const newSlides = [
        ...leftSlides,
        ...rightSlides,
    ];
    const newActiveSlideIndex = rightActiveSlideIndex !== -1
        ? rightActiveSlideIndex + leftSlides.length
        : leftActiveSlideIndex !== -1
            ? leftActiveSlideIndex
            : activeSlideIndex - removedSlidesFromLeftSide;
    const activeItemIndex = newSlides[newActiveSlideIndex].itemIndex;
    const slidesChanged = Boolean(removedSlidesFromLeftSide || removedSlidesFromRightSide || newActiveSlideIndex !== activeSlideIndex);

    return new RemoveExcessiveResult(newSlides, newOffset, newActiveSlideIndex, activeItemIndex, slidesChanged);
}
