import { CarouselError } from '../../../models/carousel-error';
import { CarouselSlide } from '../../../models/carousel-slide';
import { MOCK_SLIDE_PARAMS } from '../../../models/test/mock-slide-params.const';
import { assertSequence, collectOccurences } from './collect-occurences';

describe('collectOccurences test suite', () => {

    it('must collect unremovable elements without inViewport flag', () => {
        const slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
        ];
        const offset = 0;
        const slideWidth = 10;
        const viewport = 100;
        const itemsLength = 3;
        const result = collectOccurences(
            slides,
            offset,
            slideWidth,
            viewport,
            itemsLength,
        );
        expect(result.size).toBe(3, 'incorrect length');
        expect(result.get(0)?.removableSlideIndexes).toEqual([], 'incorrect 0 removables');
        expect(result.get(0)?.unremovableSlideIndexes).toEqual([0], 'incorrect 0 unremovables');
        expect(result.get(1)?.removableSlideIndexes).toEqual([], 'incorrect 1 removables');
        expect(result.get(1)?.unremovableSlideIndexes).toEqual([1], 'incorrect 1 unremovables');
        expect(result.get(2)?.removableSlideIndexes).toEqual([], 'incorrect 2 removables');
        expect(result.get(2)?.unremovableSlideIndexes).toEqual([2], 'incorrect 2 unremovables');
    });

    it('must collect removable elements without inViewport flag', () => {
        const slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
        ];
        const offset = -50;
        const slideWidth = 10;
        const viewport = 100;
        const itemsLength = 3;
        const result = collectOccurences(
            slides,
            offset,
            slideWidth,
            viewport,
            itemsLength,
        );
        expect(result.size).toBe(3, 'incorrect length');
        expect(result.get(0)?.removableSlideIndexes).toEqual([0], 'incorrect 0 removables');
        expect(result.get(0)?.unremovableSlideIndexes).toEqual([], 'incorrect 0 unremovables');
        expect(result.get(1)?.removableSlideIndexes).toEqual([1], 'incorrect 1 removables');
        expect(result.get(1)?.unremovableSlideIndexes).toEqual([], 'incorrect 1 unremovables');
        expect(result.get(2)?.removableSlideIndexes).toEqual([2], 'incorrect 2 removables');
        expect(result.get(2)?.unremovableSlideIndexes).toEqual([], 'incorrect 2 unremovables');
    });

    it('must collect removable and unremovable elements without inViewport flag', () => {
        const slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
            new CarouselSlide(3, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(4, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(5, 2, MOCK_SLIDE_PARAMS),
        ];
        const offset = -20;
        const slideWidth = 10;
        const viewport = 100;
        const itemsLength = 3;
        const result = collectOccurences(
            slides,
            offset,
            slideWidth,
            viewport,
            itemsLength,
        );
        expect(result.size).toBe(3, 'incorrect length');
        expect(result.get(0)?.removableSlideIndexes).toEqual([0], 'incorrect 0 removables');
        expect(result.get(0)?.unremovableSlideIndexes).toEqual([3], 'incorrect 0 unremovables');
        expect(result.get(1)?.removableSlideIndexes).toEqual([1], 'incorrect 1 removables');
        expect(result.get(1)?.unremovableSlideIndexes).toEqual([4], 'incorrect 1 unremovables');
        expect(result.get(2)?.removableSlideIndexes).toEqual([], 'incorrect 2 removables');
        expect(result.get(2)?.unremovableSlideIndexes).toEqual([2, 5], 'incorrect 2 unremovables');
    });

    it('must throw on incorrect sequence', () => {
        expect(() => collectOccurences(
            [
                new CarouselSlide(0, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 0, MOCK_SLIDE_PARAMS),
            ], 0, 0, 0, 0,
        )).toThrowError(CarouselError);
    });
});

describe('assertSequence test suite', () => {

    it('must return slide index on correct chunk', () => {
        expect(assertSequence(1, 0, 200)).toBe(1);
    });

    it('must not throw on correct sequence reset', () => {
        expect(assertSequence(0, 5, 6)).toBe(0);
    });

    it('must throw on incorrect sequence', () => {
        expect(() => assertSequence(0, 5, 7)).toThrowError(CarouselError);
        expect(() => assertSequence(4, 2, 7)).toThrowError(CarouselError);
    });

});
