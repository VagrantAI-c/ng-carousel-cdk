import { CarouselSlideContext } from './carousel-slide-context';
import { CarouselSlideParams } from './carousel-slide-params';

/**
 * Slide model representation
 */
export class CarouselSlide<T = any> {

    public readonly context: CarouselSlideContext<T> = {
        $implicit: this.options.item,
        itemIndex: this.itemIndex,
        isActive: this.options.isActive,
        inViewport: this.options.inViewport,
        activeOnTheLeft: this.options.activeOnTheLeft,
        activeOnTheRight: this.options.activeOnTheRight,
    };

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
        public options: CarouselSlideParams<T>,
    ) {
    }

}
