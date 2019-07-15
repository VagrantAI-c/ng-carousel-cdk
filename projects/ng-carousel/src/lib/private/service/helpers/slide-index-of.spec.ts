import { CarouselSlide } from '../../models/carousel-slide';
import { slideIndexOf } from './slide-index-of';
import { CarouselError } from '../../models/carousel-error';

describe('slideIndexOf test suite', () => {

    it('should find closest slide', () => {
        const slides = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 3),
        ];
        const result = slideIndexOf(
            slides,
            0,
            3,
        );
        expect(result).toBe(3);
    });

    it('should find closest slide with duplicate item indexes', () => {
        const slides = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 0),
            new CarouselSlide(4, 1),
            new CarouselSlide(5, 2),
            new CarouselSlide(6, 0),
            new CarouselSlide(7, 1),
        ];
        const result = slideIndexOf(
            slides,
            3,
            1,
        );
        expect(result).toBe(4);
    });

    it('should throw whether item index is not preset', () => {
        const slides = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 0),
            new CarouselSlide(4, 1),
            new CarouselSlide(5, 2),
            new CarouselSlide(6, 0),
            new CarouselSlide(7, 1),
        ];
        expect(() => slideIndexOf(
            slides,
            3,
            200,
        ))
            .toThrowError(CarouselError);
    });

    it('should return itself whether desired slide is active', () => {
        const slides = [
            new CarouselSlide(0, 1),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 1),
            new CarouselSlide(3, 1),
            new CarouselSlide(4, 1),
            new CarouselSlide(5, 1),
            new CarouselSlide(6, 1),
            new CarouselSlide(7, 1),
        ];
        const result = slideIndexOf(
            slides,
            3,
            1,
        );
        expect(result).toBe(3);
    });

});
