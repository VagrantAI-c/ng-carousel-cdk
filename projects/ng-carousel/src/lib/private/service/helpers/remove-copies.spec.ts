import { removeCopies } from './remove-copies';
import { CarouselSlide } from '../../models/carousel-slide';
import { CarouselError } from '../../models/carousel-error';

describe('removeCopies test suite', () => {

    it('must not remove slides', () => {
        const result = removeCopies([
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
        ], 0, 5, 100, 3);
        expect(result[0].itemIndex).toBe(0);
        expect(result[1].itemIndex).toBe(1);
        expect(result[2].itemIndex).toBe(2);
    });

    it('must not remove offscreen slides', () => {
        const result = removeCopies([
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
        ], -50, 5, 100, 3);
        expect(result[0].itemIndex).toBe(0);
        expect(result[1].itemIndex).toBe(1);
        expect(result[2].itemIndex).toBe(2);
    });

    it('must not remove copy slides in viewport', () => {
        const result = removeCopies([
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 0),
        ], 0, 5, 100, 3);
        expect(result.length).toBe(4);
        expect(result[0].itemIndex).toBe(0);
        expect(result[1].itemIndex).toBe(1);
        expect(result[2].itemIndex).toBe(2);
        expect(result[3].itemIndex).toBe(0);
    });

    it('must remove copy slides outside viewport', () => {
        const result = removeCopies([
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 0),
        ], 0, 100, 100, 3);
        expect(result.length).toBe(3);
        expect(result[0].itemIndex).toBe(0);
        expect(result[1].itemIndex).toBe(1);
        expect(result[2].itemIndex).toBe(2);
    });

    it('must throw on incorrect sequence', () => {
        expect(() => removeCopies([
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 3),
            new CarouselSlide(3, 0),
        ], 0, 100, 100, 3)).toThrowError(CarouselError);
    });

    it('must remove copy slides', () => {
        const result = removeCopies([
            new CarouselSlide(0, 2),
            new CarouselSlide(1, 0),
            new CarouselSlide(2, 1),
            new CarouselSlide(3, 2),
            new CarouselSlide(4, 0),
            new CarouselSlide(5, 1),
        ], -30, 5, 100, 3);
        expect(result.length).toBe(3);
        expect(result[0].itemIndex).toBe(2);
        expect(result[1].itemIndex).toBe(0);
        expect(result[2].itemIndex).toBe(1);
    });

    it('must remove copy slides but not inside viewport', () => {
        const result = removeCopies([
            new CarouselSlide(0, 2),
            new CarouselSlide(1, 0),
            new CarouselSlide(2, 1),
            new CarouselSlide(3, 2),
            new CarouselSlide(4, 0),
            new CarouselSlide(5, 1),
        ], -5, 5, 100, 3);
        expect(result.length).toBe(5);
        expect(result[0].itemIndex).toBe(0);
        expect(result[1].itemIndex).toBe(1);
        expect(result[2].itemIndex).toBe(2);
        expect(result[3].itemIndex).toBe(0);
        expect(result[4].itemIndex).toBe(1);
    });

    it('must remove copy slides without losing sequence', () => {
        const slides = [];
        const itemsLength = 1;
        for (let i = 0; i < 300; i++) {
            slides.push(new CarouselSlide(i, 0));
        }
        const offset = 0;
        const slideWidth = 1;
        const viewportWidth = 200;
        const result = removeCopies(
            slides,
            offset,
            slideWidth,
            viewportWidth,
            itemsLength
        );
        expect(result.length).toBe(viewportWidth, 'incorrect length');
        for (let i = 0; i < viewportWidth; i++) {
            expect(result[i].id)
                .withContext(`incorrect ${i} id`)
                .toBe(i);
        }
    });

    it('must remove empty array whether slides are not present', () => {
        expect(removeCopies([], 0, 0, 0, 0)).toEqual([]);
        expect(removeCopies(undefined, 0, 0, 0, 0)).toEqual([]);
    });

});
