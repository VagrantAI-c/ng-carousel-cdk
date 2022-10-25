/**
 * Animation state that is currently in process
 */
export class CarouselAnimation {

    constructor(
        public from: number,
        public to: number,
        public player?: Animation | null,
        public startTime = new Date().getTime(),
    ) {
    }

}
