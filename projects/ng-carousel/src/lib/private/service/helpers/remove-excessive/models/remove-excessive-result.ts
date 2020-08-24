import { CarouselSlide } from '../../../../models/carousel-slide';

export class RemoveExcessiveResult {
    constructor(
        public slides: CarouselSlide[],
        public offset: number,
    ) {
    }
}
