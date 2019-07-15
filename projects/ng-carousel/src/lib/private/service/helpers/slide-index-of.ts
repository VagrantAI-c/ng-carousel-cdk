import { CarouselSlide } from '../../models/carousel-slide';
import { CarouselError } from '../../models/carousel-error';

/**
 * Transforms desired item index to slide index.
 * Picks closest slide to the current (in case
 * there are multiple slides with same item index).
 * @returns desired slide index or `null` whether
 * slide with desired item was not found.
 */
export function slideIndexOf(
    slides: CarouselSlide[],
    currentSlideIndex: number,
    desiredItemIndex: number,
): number {
    let closestSlideIndex = null;
    let closestSlideDistance = null;
    for (let i = 0; i < slides.length; i++) {
        if (slides[i].itemIndex !== desiredItemIndex) {

            continue;
        }
        const distance = Math.abs(i - currentSlideIndex);
        if (closestSlideDistance === null || distance < closestSlideDistance) {
            closestSlideIndex = i;
            closestSlideDistance = distance;
        }
    }

    if (closestSlideIndex === null) {

        throw new CarouselError(`Desired item index ${desiredItemIndex} is not present on slide array`);
    }

    return closestSlideIndex;
}
