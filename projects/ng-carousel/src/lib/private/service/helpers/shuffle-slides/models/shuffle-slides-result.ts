import { CarouselSlide } from '../../../../models/carousel-slide';

/**
 * Result for helper function `shuffleSlides`
 */
export class ShuffleSlidesResult {

    constructor(
        public slides: CarouselSlide[] = [],
        public modifiedOffset = 0,
        public slidesChanged = false,
    ) {
    }

}
