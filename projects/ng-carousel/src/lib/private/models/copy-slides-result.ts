import { CarouselSlide } from './carousel-slide';

/**
 * Result for helper function `moveOrCopySlidesTo`
 */
export class CopySlidesResult {

    constructor(
        public slides: CarouselSlide[] = [],
        public modifiedOffset = 0,
        /** Item indexes that should be marked as copy */
        public unmarkedItemIndexes = [],
    ) {
    }

}
