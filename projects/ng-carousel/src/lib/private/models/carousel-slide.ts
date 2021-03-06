import { CarouselSlideParams } from './carousel-slide-params';

/**
 * Slide model representation
 */
export class CarouselSlide<T = any> {

    constructor(
        /**
         * Id is used in trackBy and should be generated
         * with `IdGenerator`
         */
        public id: number,
        /**
         * Represents index from `items` array of carousel
         * config
         */
        public itemIndex: number,
        /**
         * Parameters that might be changed over time
         */
        public options: Partial<CarouselSlideParams<T>> = {},
    ) {
    }

}
