import { CarouselSlide } from '../../../models/carousel-slide';
import { CarouselSlideParams } from '../../../models/carousel-slide-params';
import { IdGenerator } from '../../../models/id-generator';

/**
 * Fills empty carousel with slides without any
 * alignments
 */
export function initializeCarousel(
    items: any[],
    idGenerator: IdGenerator | null,
): CarouselSlide[] {
    if (!items || !items.length || !idGenerator) {

        return [];
    }

    const newSlides = new Array(items.length);

    for (let i = 0; i < items.length; i++) {
        const state: CarouselSlideParams = {
            item: items[i],
            isActive: i === 0,
            inViewport: false,
            activeOnTheLeft: i > 0,
            activeOnTheRight: false,
        };
        newSlides[i] = new CarouselSlide(idGenerator.next(), i, state);
    }

    return newSlides;
}
