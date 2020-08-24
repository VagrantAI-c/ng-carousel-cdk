import { CarouselSlide } from '../../../../models/carousel-slide';

export class MarkVisibleAndActiveResult {

    // Viewport range is subarray of slides which are
    // currently in viewport
    constructor(
        public slides: CarouselSlide[],
        public inViewportRangeStart: number,
        public inViewportRangeEnd: number,
    ) {
    }

}
