import { CarouselSlide } from '../../models/carousel-slide';
import { markVisibleAndActive } from './mark-visible-and-active';

describe('markVisibleAndActive test suite', () => {

    let slides3: CarouselSlide[];
    let slides3AllVisible: CarouselSlide[];

    beforeEach(() => {
        slides3 = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
        ];
        slides3AllVisible = [
            new CarouselSlide(0, 0, {inViewport: true}),
            new CarouselSlide(1, 1, {inViewport: true}),
            new CarouselSlide(2, 2, {inViewport: true}),
        ];
    });

    it('should mark common pattern', () => {
        const result = markVisibleAndActive(slides3, -10, 40, 100, 0);
        expect(result[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
        expect(result[1].options.inViewport).toBeTruthy('incorrect 1 inViewport');
        expect(result[2].options.inViewport).toBeTruthy('incorrect 2 inViewport');
        expect(result[0].options.isActive).toBeTruthy('incorrect 0 isActive');
        expect(result[1].options.isActive).toBeFalsy('incorrect 1 isActive');
        expect(result[2].options.isActive).toBeFalsy('incorrect 2 isActive');
    });

    it('should not mark slides outside viewport', () => {
        const result = markVisibleAndActive(slides3AllVisible, -100, 2, 100, 1);
        expect(result[0].options.inViewport).toBeFalsy('incorrect 0 inViewport');
        expect(result[1].options.inViewport).toBeFalsy('incorrect 1 inViewport');
        expect(result[2].options.inViewport).toBeFalsy('incorrect 2 inViewport');
        expect(result[0].options.isActive).toBeFalsy('incorrect 0 isActive');
        expect(result[1].options.isActive).toBeTruthy('incorrect 1 isActive');
        expect(result[2].options.isActive).toBeFalsy('incorrect 2 isActive');
    });

    it('should mark mixed content', () => {
        const result = markVisibleAndActive(slides3AllVisible, 80, 20, 100, 30);
        expect(result[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
        expect(result[1].options.inViewport).toBeFalsy('incorrect 1 inViewport');
        expect(result[2].options.inViewport).toBeFalsy('incorrect 2 inViewport');
        expect(result[0].options.isActive).toBeFalsy('incorrect 0 isActive');
        expect(result[1].options.isActive).toBeFalsy('incorrect 1 isActive');
        expect(result[2].options.isActive).toBeFalsy('incorrect 2 isActive');
    });

    it('should not calculate on incorrect slides input', () => {
        const emptyResult = markVisibleAndActive([], 0, 0, 0, 0);
        expect(emptyResult).toEqual([]);
        const nullResult = markVisibleAndActive(null, 0, 0, 0, 0);
        expect(nullResult).toEqual([]);
    });

});
