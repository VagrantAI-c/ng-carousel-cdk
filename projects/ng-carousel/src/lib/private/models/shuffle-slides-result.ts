import { CarouselSlide } from './carousel-slide';

/**
 * Result for helper function `shuffleSlides`
 */
export class ShuffleSlidesResult {

    constructor(
        public slides: CarouselSlide[] = [],
        public modifiedOffset = 0,
    ) {
    }

}
