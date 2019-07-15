/**
 * Generator for `CarouselSlide` id, should be
 * singleton throughout single carousel.
 */
export class IdGenerator {
    private index = 0;

    next(): number {
        return this.index++;
    }
}
