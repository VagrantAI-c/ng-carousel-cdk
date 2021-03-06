import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { CarouselSlide } from '../../../models/carousel-slide';
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
        const offset = -10;
        const slideWidth = 40;
        const viewportWidth = 100;
        const activeSlideIndex = 0;
        const threshold = 3;
        const alignMode = CarouselAlignMode.LEFT;
        const result = markVisibleAndActive(slides3AllVisible, offset, slideWidth, viewportWidth, activeSlideIndex, threshold, alignMode);
        expect(result.slides[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
        expect(result.slides[1].options.inViewport).toBeTruthy('incorrect 1 inViewport');
        expect(result.slides[2].options.inViewport).toBeTruthy('incorrect 2 inViewport');
        expect(result.slides[0].options.isActive).toBeTruthy('incorrect 0 isActive');
        expect(result.slides[1].options.isActive).toBeFalsy('incorrect 1 isActive');
        expect(result.slides[2].options.isActive).toBeFalsy('incorrect 2 isActive');
        expect(result.inViewportRangeStart).toBe(0, 'incorrect viewport range start');
        expect(result.inViewportRangeEnd).toBe(2, 'incorrect viewport range end');
    });

    it('should not mark slides outside viewport', () => {
        const offset = -100;
        const slideWidth = 2;
        const viewportWidth = 100;
        const activeSlideIndex = 1;
        const threshold = 0;
        const alignMode = CarouselAlignMode.LEFT;
        const result = markVisibleAndActive(slides3AllVisible, offset, slideWidth, viewportWidth, activeSlideIndex, threshold, alignMode);
        expect(result.slides[0].options.inViewport).toBeFalsy('incorrect 0 inViewport');
        expect(result.slides[1].options.inViewport).toBeFalsy('incorrect 1 inViewport');
        expect(result.slides[2].options.inViewport).toBeFalsy('incorrect 2 inViewport');
        expect(result.slides[0].options.isActive).toBeFalsy('incorrect 0 isActive');
        expect(result.slides[1].options.isActive).toBeTruthy('incorrect 1 isActive');
        expect(result.slides[2].options.isActive).toBeFalsy('incorrect 2 isActive');
        expect(result.inViewportRangeStart).toBe(1, 'incorrect viewport range start');
        expect(result.inViewportRangeEnd).toBe(2, 'incorrect viewport range end');
    });

    it('should mark mixed content', () => {
        const offset = 80;
        const slideWidth = 20;
        const viewportWidth = 100;
        const activeSlideIndex = 30;
        const threshold = 1;
        const alignMode = CarouselAlignMode.LEFT;
        const result = markVisibleAndActive(slides3AllVisible, offset, slideWidth, viewportWidth, activeSlideIndex, threshold, alignMode);
        expect(result.slides[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
        expect(result.slides[1].options.inViewport).toBeTruthy('incorrect 1 inViewport');
        expect(result.slides[2].options.inViewport).toBeFalsy('incorrect 2 inViewport');
        expect(result.slides[0].options.isActive).toBeFalsy('incorrect 0 isActive');
        expect(result.slides[1].options.isActive).toBeFalsy('incorrect 1 isActive');
        expect(result.slides[2].options.isActive).toBeFalsy('incorrect 2 isActive');
        expect(result.inViewportRangeStart).toBe(0, 'incorrect viewport range start');
        expect(result.inViewportRangeEnd).toBe(1, 'incorrect viewport range end');
    });

    it('should calculate ranges', () => {
        const slides = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 3),
            new CarouselSlide(4, 4),
            new CarouselSlide(5, 5),
            new CarouselSlide(6, 6),
            new CarouselSlide(7, 7),
        ];
        const offset = -60;
        const slideWidth = 20;
        const viewportWidth = 100;
        const activeSlideIndex = 0;
        const threshold = 2;
        const alignMode = CarouselAlignMode.LEFT;
        const result = markVisibleAndActive(slides, offset, slideWidth, viewportWidth, activeSlideIndex, threshold, alignMode);
        expect(result.inViewportRangeStart).toBe(0, 'incorrect viewport range start');
        expect(result.inViewportRangeEnd).toBe(7, 'incorrect viewport range end');
    });

    it('should prolong range for active slide outside viewport', () => {
        const slides = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 3),
            new CarouselSlide(4, 4),
            new CarouselSlide(5, 5),
            new CarouselSlide(6, 6),
            new CarouselSlide(7, 7),
            new CarouselSlide(8, 8),
            new CarouselSlide(9, 9),
            new CarouselSlide(10, 10),
            new CarouselSlide(11, 11),
        ];
        const offset = -100;
        const slideWidth = 20;
        const viewportWidth = 40;
        const activeSlideIndex = 2;
        const threshold = 1;
        const alignMode = CarouselAlignMode.LEFT;
        const result = markVisibleAndActive(slides, offset, slideWidth, viewportWidth, activeSlideIndex, threshold, alignMode);
        expect(result.inViewportRangeStart).toBe(1, 'incorrect viewport range start');
        expect(result.inViewportRangeEnd).toBe(7, 'incorrect viewport range end');
    });

});
