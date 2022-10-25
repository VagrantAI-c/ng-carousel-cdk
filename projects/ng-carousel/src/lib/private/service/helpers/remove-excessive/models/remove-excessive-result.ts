import { CarouselSlide } from '../../../../models/carousel-slide';

export class RemoveExcessiveResult {
    constructor(
        public slides: CarouselSlide[],
        public offset: number,
        public activeSlideIndex: number,
        public activeItemIndex: number,
        public slidesChanged: boolean,
    ) {
    }
}
