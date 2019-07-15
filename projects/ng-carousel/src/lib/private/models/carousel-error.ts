export class CarouselError extends Error {

    constructor(
        public message: string,
    ) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
    }

}
