import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { CarouselSlide } from '../../../models/carousel-slide';
import { MOCK_SLIDE_PARAMS } from '../../../models/test/mock-slide-params.const';
import { markVisibleAndActive } from './mark-visible-and-active';

describe('markVisibleAndActive test suite', () => {

    let slides3: CarouselSlide[];
    let slides3AllVisible: CarouselSlide[];

    beforeEach(() => {
        slides3 = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
        ];
        slides3AllVisible = [
            new CarouselSlide(0, 0, Object.assign({}, MOCK_SLIDE_PARAMS, {inViewport: true})),
            new CarouselSlide(1, 1, Object.assign({}, MOCK_SLIDE_PARAMS, {inViewport: true})),
            new CarouselSlide(2, 2, Object.assign({}, MOCK_SLIDE_PARAMS, {inViewport: true})),
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
        expect(result.slides[0].options.inViewport).toBeTrue();
        expect(result.slides[1].options.inViewport).toBeTrue();
        expect(result.slides[2].options.inViewport).toBeTrue();
        expect(result.slides[0].options.isActive).toBeTrue();
        expect(result.slides[1].options.isActive).toBeFalse();
        expect(result.slides[2].options.isActive).toBeFalse();
        expect(result.slides[0].options.activeOnTheLeft).toBeFalse();
        expect(result.slides[1].options.activeOnTheLeft).toBeTrue();
        expect(result.slides[2].options.activeOnTheLeft).toBeTrue();
        expect(result.slides[0].options.activeOnTheRight).toBeFalse();
        expect(result.slides[1].options.activeOnTheRight).toBeFalse();
        expect(result.slides[2].options.activeOnTheRight).toBeFalse();
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
        expect(result.slides[0].options.inViewport).toBeFalse();
        expect(result.slides[1].options.inViewport).toBeFalse();
        expect(result.slides[2].options.inViewport).toBeFalse();
        expect(result.slides[0].options.isActive).toBeFalse();
        expect(result.slides[1].options.isActive).toBeTrue();
        expect(result.slides[2].options.isActive).toBeFalse();
        expect(result.slides[0].options.activeOnTheLeft).toBeFalse();
        expect(result.slides[1].options.activeOnTheLeft).toBeFalse();
        expect(result.slides[2].options.activeOnTheLeft).toBeTrue();
        expect(result.slides[0].options.activeOnTheRight).toBeTrue();
        expect(result.slides[1].options.activeOnTheRight).toBeFalse();
        expect(result.slides[2].options.activeOnTheRight).toBeFalse();
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
        expect(result.slides[0].options.inViewport).toBeTrue();
        expect(result.slides[1].options.inViewport).toBeTrue();
        expect(result.slides[2].options.inViewport).toBeFalse();
        expect(result.slides[0].options.isActive).toBeFalse();
        expect(result.slides[1].options.isActive).toBeFalse();
        expect(result.slides[2].options.isActive).toBeFalse();
        expect(result.slides[0].options.activeOnTheLeft).toBeFalse();
        expect(result.slides[1].options.activeOnTheLeft).toBeFalse();
        expect(result.slides[2].options.activeOnTheLeft).toBeFalse();
        expect(result.slides[0].options.activeOnTheRight).toBeTrue();
        expect(result.slides[1].options.activeOnTheRight).toBeTrue();
        expect(result.slides[2].options.activeOnTheRight).toBeTrue();
        expect(result.inViewportRangeStart).toBe(0, 'incorrect viewport range start');
        expect(result.inViewportRangeEnd).toBe(1, 'incorrect viewport range end');
    });

    it('should calculate ranges', () => {
        const slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
            new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
            new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
            new CarouselSlide(5, 5, MOCK_SLIDE_PARAMS),
            new CarouselSlide(6, 6, MOCK_SLIDE_PARAMS),
            new CarouselSlide(7, 7, MOCK_SLIDE_PARAMS),
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
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
            new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
            new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
            new CarouselSlide(5, 5, MOCK_SLIDE_PARAMS),
            new CarouselSlide(6, 6, MOCK_SLIDE_PARAMS),
            new CarouselSlide(7, 7, MOCK_SLIDE_PARAMS),
            new CarouselSlide(8, 8, MOCK_SLIDE_PARAMS),
            new CarouselSlide(9, 9, MOCK_SLIDE_PARAMS),
            new CarouselSlide(10, 10, MOCK_SLIDE_PARAMS),
            new CarouselSlide(11, 11, MOCK_SLIDE_PARAMS),
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
