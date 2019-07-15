import { CarouselWidthMode } from '../../carousel-width-mode';

/**
 * Snapshot of carousel offset for current animation
 */
export class Offset {
    constructor(
        public offset: number,
        public mode: CarouselWidthMode,
    ) {
    }
}
