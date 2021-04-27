import { CarouselSlide } from '../../../models/carousel-slide';
import { MOCK_SLIDE_PARAMS } from '../../../models/test/mock-slide-params.const';
import { findSlideIndex } from './find-slide-index';

describe('findItemIndex test suite', () => {

    it('must find item index', () => {
        const newItemIndex = 2;
        const currentSlideIndex = 1;
        const result = findSlideIndex(
            [
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(0, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(0, 2, MOCK_SLIDE_PARAMS),
                new CarouselSlide(0, 3, MOCK_SLIDE_PARAMS),
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
                new CarouselSlide(0, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 1, MOCK_SLIDE_PARAMS),
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
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(0, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 0, MOCK_SLIDE_PARAMS),
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
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 0, MOCK_SLIDE_PARAMS),
            ],
            newItemIndex,
            currentSlideIndex,
        );
        expect(result).toBe(1);
    });

    it('must return 0 whether index not found', () => {
        const newItemIndex = 1;
        const currentSlideIndex = 1;
        const result = findSlideIndex(
            [
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 0, MOCK_SLIDE_PARAMS),
            ],
            newItemIndex,
            currentSlideIndex,
        );
        expect(result).toBe(0, 'result not zero');
    });

    it('must return 0 when no slides available', () => {
        expect(findSlideIndex([], 10, 10)).toBe(0);
        expect(findSlideIndex(null, 10, 10)).toBe(0);
    });
});
