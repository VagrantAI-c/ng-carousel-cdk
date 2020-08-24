import { CarouselSlide } from '../../../models/carousel-slide';
import { IdGenerator } from '../../../models/id-generator';

/**
 * Fills empty carousel with slides without any
 * alignments
 */
export function initializeCarousel(
    items: any[],
    idGenerator: IdGenerator,
): CarouselSlide[] {
    if (!items || !items.length || !idGenerator) {

        return [];
    }

    const newSlides = new Array(items.length);

    for (let i = 0; i < items.length; i++) {
        newSlides[i] = new CarouselSlide(idGenerator.next(), i, {item: items[i], isActive: i === 0});
    }

    return newSlides;
}
