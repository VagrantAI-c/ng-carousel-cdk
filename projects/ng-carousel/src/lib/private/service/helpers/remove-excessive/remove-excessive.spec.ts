import { CarouselSlide } from '../../../models/carousel-slide';
import { removeExcessive } from './remove-excessive';

describe('removeExcessive test suite', () => {

    let slides7: CarouselSlide[];

    beforeEach(() => {
        slides7 = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 3),
            new CarouselSlide(4, 4),
            new CarouselSlide(5, 5),
            new CarouselSlide(6, 6),
        ];
    });

    it('should not remove slides when all indexes are present without copies', () => {
        const offset = -20;
        const slideWidth = 20;
        const viewportStartIndex = 1;
        const viewportEndIndex = 4;
        const result = removeExcessive(
            slides7,
            offset,
            slideWidth,
            viewportStartIndex,
            viewportEndIndex,
        );
        expect(result.offset).toBe(-20, 'incorrect offset');
        expect(result.slides.length).toBe(slides7.length, 'incorrect length');
        for (let i = 0; i < result.slides.length; i++) {
            expect(result.slides[i].id).toBe(i, `incorrect slide ${i} id`);
        }
    });

    it('should remove copies', () => {
        const offset = -20;
        const slideWidth = 20;
        const viewportStartIndex = 1;
        const viewportEndIndex = 4;
        const result = removeExcessive(
            [
                ...slides7,
                new CarouselSlide(7, 0),
                new CarouselSlide(8, 1),
            ],
            offset,
            slideWidth,
            viewportStartIndex,
            viewportEndIndex,
        );
        expect(result.offset).toBe(0, 'incorrect offset');
        expect(result.slides.length).toBe(slides7.length, 'incorrect length');
        for (let i = 0; i < result.slides.length; i++) {
            expect(result.slides[i].id).toBe(i + 1, `incorrect slide ${i} id`);
        }
    });

    it('should return empty slides when no slides available', () => {
        const nullResult = removeExcessive(null, 10, 0, 0, 0);
        expect(nullResult.offset).toBe(10, 'incorrect offset');
        expect(nullResult.slides).toEqual([], 'incorrect slides fallback');
        const emptyResult = removeExcessive([], 11, 0, 0, 0);
        expect(emptyResult.offset).toBe(11, 'incorrect offset');
        expect(emptyResult.slides).toEqual([], 'incorrect slides fallback');
    });
});
