import { CarouselError } from '../../../models/carousel-error';
import { CarouselSlide } from '../../../models/carousel-slide';
import { findSlideIndex } from './find-slide-index';

describe('findItemIndex test suite', () => {

    it('must find item index', () => {
        const newItemIndex = 2;
        const currentSlideIndex = 1;
        const result = findSlideIndex(
            [
                new CarouselSlide(0, 0),
                new CarouselSlide(0, 1),
                new CarouselSlide(0, 2),
                new CarouselSlide(0, 3),
            ],
            newItemIndex,
            currentSlideIndex,
        );
        expect(result).toBe(2);
    });

    it('must find closest index on increment', () => {
        const newItemIndex = 1;
        const currentSlideIndex = 1;
        const result = findSlideIndex(
            [
                new CarouselSlide(0, 1),
                new CarouselSlide(1, 0),
                new CarouselSlide(2, 1),
                new CarouselSlide(2, 0),
                new CarouselSlide(2, 1),
            ],
            newItemIndex,
            currentSlideIndex,
        );
        expect(result).toBe(2);
    });

    it('must find closest index on decrement', () => {
        const newItemIndex = 0;
        const currentSlideIndex = 3;
        const result = findSlideIndex(
            [
                new CarouselSlide(0, 0),
                new CarouselSlide(0, 1),
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 1),
                new CarouselSlide(2, 0),
            ],
            newItemIndex,
            currentSlideIndex,
        );
        expect(result).toBe(2);
    });

    it('must return same index', () => {
        const newItemIndex = 0;
        const currentSlideIndex = 1;
        const result = findSlideIndex(
            [
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 0),
                new CarouselSlide(2, 0),
            ],
            newItemIndex,
            currentSlideIndex,
        );
        expect(result).toBe(1);
    });

    it('must return null whether index not found', () => {
        const newItemIndex = 1;
        const currentSlideIndex = 1;
        const result = findSlideIndex(
            [
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 0),
                new CarouselSlide(2, 0),
            ],
            newItemIndex,
            currentSlideIndex,
        );
        expect(result).toBeNull('result not null');
    });

    it('must return 0 when no slides available', () => {
        expect(findSlideIndex([], 10, 10)).toBe(0);
        expect(findSlideIndex(null, 10, 10)).toBe(0);
    });
});
