import { CarouselSlide } from '../../../../models/carousel-slide';

/**
 * Result for helper function `moveOrCopySlidesTo`
 */
export class CopySlidesResult<T> {

    constructor(
        public slides: CarouselSlide<T>[] = [],
        public modifiedOffset = 0,
        public slidesChanged = false,
    ) {
    }

}
