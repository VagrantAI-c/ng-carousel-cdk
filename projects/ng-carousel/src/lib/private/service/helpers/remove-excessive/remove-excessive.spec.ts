import { CarouselSlide } from '../../../models/carousel-slide';
import { CarouselSlideParams } from '../../../models/carousel-slide-params';
import { MOCK_SLIDE_PARAMS } from '../../../models/test/mock-slide-params.const';
import { removeExcessive } from './remove-excessive';

describe('removeExcessive test suite', () => {

    let slides7: CarouselSlide[];

    beforeEach(() => {
        slides7 = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
            new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
            new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
            new CarouselSlide(5, 5, MOCK_SLIDE_PARAMS),
            new CarouselSlide(6, 6, MOCK_SLIDE_PARAMS),
        ];
    });

    it('should not remove slides when all indexes are present without copies', () => {
        const offset = -20;
        const slideWidth = 20;
        const activeSlideIndex = 3;
        const viewportStartIndex = 1;
        const viewportEndIndex = 4;
        const result = removeExcessive(
            slides7,
            offset,
            slideWidth,
            activeSlideIndex,
            viewportStartIndex,
            viewportEndIndex,
        );
        expect(result.offset).toBe(-20, 'incorrect offset');
        expect(result.slides.length).toBe(slides7.length, 'incorrect length');
        expect(result.activeSlideIndex).toBe(activeSlideIndex, 'incorrect slide index');
        expect(result.activeItemIndex).toBe(3, 'incorrect item index');
        expect(result.slidesChanged).toBeFalse();
        for (let i = 0; i < result.slides.length; i++) {
            expect(result.slides[i].id).toBe(i, `incorrect slide ${i} id`);
        }
    });

    it('should remove copies', () => {
        const offset = -20;
        const slideWidth = 20;
        const activeSlideIndex = 4;
        const viewportStartIndex = 1;
        const viewportEndIndex = 4;
        const result = removeExcessive(
            [
                ...slides7,
                new CarouselSlide(7, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(8, 1, MOCK_SLIDE_PARAMS),
            ],
            offset,
            slideWidth,
            activeSlideIndex,
            viewportStartIndex,
            viewportEndIndex,
        );
        expect(result.offset).toBe(0, 'incorrect offset');
        expect(result.slides.length).toBe(slides7.length, 'incorrect length');
        expect(result.slidesChanged).toBeTrue();
        for (let i = 0; i < result.slides.length; i++) {
            expect(result.slides[i].id).toBe(i + 1, `incorrect slide ${i} id`);
        }
    });

    it('should not remove slides when all slides are in viewport (or a copy)', () => {
        const offset = -28;
        const slideWidth = 12;
        const activeSlideIndex = 6;
        const viewportStartIndex = 1;
        const viewportEndIndex = 11;
        const inViewportParams: CarouselSlideParams = {
            ...MOCK_SLIDE_PARAMS,
            inViewport: true,
        };
        const activeSlideParams: CarouselSlideParams = {
            ...inViewportParams,
            isActive: true,
        };
        const slides = [
            new CarouselSlide(0, 1, MOCK_SLIDE_PARAMS), // First slide is not in viewport
            new CarouselSlide(1, 2, inViewportParams),
            new CarouselSlide(2, 0, inViewportParams),
            new CarouselSlide(3, 1, inViewportParams),
            new CarouselSlide(4, 2, inViewportParams),
            new CarouselSlide(5, 0, inViewportParams),
            new CarouselSlide(6, 1, activeSlideParams),
            new CarouselSlide(7, 2, inViewportParams),
            new CarouselSlide(8, 0, inViewportParams),
            new CarouselSlide(9, 1, inViewportParams),
            new CarouselSlide(10, 2, inViewportParams),
            new CarouselSlide(11, 0, inViewportParams),
        ];
        const result = removeExcessive(
            slides,
            offset,
            slideWidth,
            activeSlideIndex,
            viewportStartIndex,
            viewportEndIndex,
        );

        // Should remove 1 slide
        expect(result.offset).toBe(offset + slideWidth, 'incorrect offset');
        expect(result.slides.length).toBe(slides.length - 1, 'incorrect slides length');
        expect(result.activeSlideIndex).toBe(5, 'incorrect active slide index');
        expect(result.activeItemIndex).toBe(1, 'incorrect active item index');
        expect(result.slidesChanged).toBeTrue();
        for (let i = 0; i < result.slides.length; i++) {
            expect(result.slides[i].id).toBe(i + 1, `incorrect slide ${i} id`);
        }
    });

    it('should fix correct slide based on slide options', () => {
        const offset = -40;
        const slideWidth = 30;
        const activeSlideIndex = 0;
        const viewportStartIndex = 1;
        const viewportEndIndex = 4;
        const inViewportParams: CarouselSlideParams = {
            ...MOCK_SLIDE_PARAMS,
            inViewport: true,
        };
        const activeSlideParams: CarouselSlideParams = {
            ...inViewportParams,
            isActive: true,
        };
        const slides = [
            new CarouselSlide(0, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 2, inViewportParams),
            new CarouselSlide(2, 0, activeSlideParams),
            new CarouselSlide(3, 1, inViewportParams),
            new CarouselSlide(4, 2, inViewportParams),
            new CarouselSlide(5, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(6, 1, MOCK_SLIDE_PARAMS),
        ];
        const result = removeExcessive(
            slides,
            offset,
            slideWidth,
            activeSlideIndex,
            viewportStartIndex,
            viewportEndIndex,
        );

        expect(result.offset).toBe(-10, 'incorrect offset');
        expect(result.slides.length).toBe(4, 'incorrect slides length');
        expect(result.activeSlideIndex).toBe(1, 'incorrect active slide index');
        expect(result.activeItemIndex).toBe(0, 'incorrect active item index');
        expect(result.slidesChanged).toBeTrue();
        for (let i = 0; i < result.slides.length; i++) {
            expect(result.slides[i].id).toBe(i + 1, `incorrect slide ${i} id`);
        }
    });

    it('should return input slide index if active slide is not found', () => {
        const offset = -40;
        const slideWidth = 30;
        const activeSlideIndex = 1;
        const viewportStartIndex = 1;
        const viewportEndIndex = 4;
        const inViewportParams: CarouselSlideParams = {
            ...MOCK_SLIDE_PARAMS,
            inViewport: true,
        };
        const slides = [
            new CarouselSlide(0, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 2, inViewportParams),
            new CarouselSlide(2, 0, inViewportParams),
            new CarouselSlide(3, 1, inViewportParams),
            new CarouselSlide(4, 2, inViewportParams),
            new CarouselSlide(5, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(6, 1, MOCK_SLIDE_PARAMS),
        ];
        const result = removeExcessive(
            slides,
            offset,
            slideWidth,
            activeSlideIndex,
            viewportStartIndex,
            viewportEndIndex,
        );

        expect(result.offset).toBe(-10, 'incorrect offset');
        expect(result.slides.length).toBe(4, 'incorrect slides length');
        expect(result.activeSlideIndex).toBe(0, 'incorrect active slide index');
        expect(result.activeItemIndex).toBe(2, 'incorrect active item index');
        expect(result.slidesChanged).toBeTrue();
        for (let i = 0; i < result.slides.length; i++) {
            expect(result.slides[i].id).toBe(i + 1, `incorrect slide ${i} id`);
        }
    });

    it('should return empty slides when no slides available', () => {
        const emptyResult = removeExcessive([], 11, 0, 0, 0, 0);
        expect(emptyResult.offset).toBe(11, 'incorrect offset');
        expect(emptyResult.activeSlideIndex).toBe(0, 'incorrect slide index');
        expect(emptyResult.activeItemIndex).toBe(0, 'incorrect item index');
        expect(emptyResult.slides).toEqual([], 'incorrect slides fallback');
        expect(emptyResult.slidesChanged).toBeFalse();
    });
});
