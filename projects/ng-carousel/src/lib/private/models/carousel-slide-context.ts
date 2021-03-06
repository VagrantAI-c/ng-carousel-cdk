/**
 * Template context for carousel slide
 */
export class CarouselSlideContext<T> {

    constructor(
        public $implicit: T | null,
        public itemIndex: number,
        public isActive: boolean,
        public inViewport: boolean,
    ) {
    }

}
