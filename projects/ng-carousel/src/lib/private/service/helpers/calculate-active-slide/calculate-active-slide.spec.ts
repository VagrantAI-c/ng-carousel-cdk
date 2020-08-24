import { CarouselAlignMode } from '../../../../../public-api';
import { CarouselSlide } from '../../../models/carousel-slide';
import { calculateActiveSlide } from './calculate-active-slide';
import { CalculateActiveSlideResult } from './models/calculate-active-slide-result';

describe('calculateActiveSlide suite', () => {

    const slides4 = [
        new CarouselSlide(0, 0),
        new CarouselSlide(1, 0),
        new CarouselSlide(2, 0),
        new CarouselSlide(3, 0),
    ];

    it('must calculate no slides', () => {
        const slides = [];
        const offset = 5000;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 10210;
        const viewportWidth = 13400;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        const expectedResult = new CalculateActiveSlideResult(offset);
        expect(result.modifiedOffset).toBe(expectedResult.modifiedOffset);
        expect(result.slideIndex).toBe(expectedResult.slideIndex);
    });

    it('must calculate for zero width', () => {
        const offset = 12345;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 0;
        const viewportWidth = 13400;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        const expectedResult = new CalculateActiveSlideResult(offset);
        expect(result.modifiedOffset).toBe(expectedResult.modifiedOffset);
        expect(result.slideIndex).toBe(expectedResult.slideIndex);
    });

    it('must calculate for viewport-width slides behind viewport', () => {
        const offset = -10;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 100;
        const viewportWidth = 100;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(0, 'normalized offset');
        expect(result.slideIndex).toBe(0, 'slide index');
    });

    it('must calculate for viewport-width slides far behind viewport', () => {
        const offset = -230;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 100;
        const viewportWidth = 100;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(-200, 'normalized offset');
        expect(result.slideIndex).toBe(2, 'slide index');
    });

    it('must calculate for viewport-width slides after viewport', () => {
        const offset = 230;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 100;
        const viewportWidth = 100;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(0, 'normalized offset');
        expect(result.slideIndex).toBe(0, 'slide index');
    });

    it('must calculate for multiple left-aligned slides behind viewport', () => {
        const offset = -80;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 60;
        const viewportWidth = 670;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(-60, 'normalized offset');
        expect(result.slideIndex).toBe(1, 'slide index');
    });

    it('must calculate for multiple left-aligned slides after viewport', () => {
        const offset = 40;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 60;
        const viewportWidth = 670;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(0, 'normalized offset');
        expect(result.slideIndex).toBe(0, 'slide index');
    });

    it('must calculate for multiple left-aligned slides far after viewport', () => {
        const offset = 1040;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 60;
        const viewportWidth = 670;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(0, 'normalized offset');
        expect(result.slideIndex).toBe(0, 'slide index');
    });

    it('must calculate for multiple center-aligned slides far after viewport', () => {
        const offset = 400;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 100;
        const viewportWidth = 600;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(250, 'normalized offset');
        expect(result.slideIndex).toBe(0, 'slide index');
    });

    it('must calculate for slides far behind from carousel center', () => {
        const offset = -20;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 10;
        const viewportWidth = 100;
        const swipeThreshold = 0; // Irrelevant to the test
        const result = calculateActiveSlide(
            slides4,
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
        );
        expect(result.modifiedOffset).toBe(15, 'normalized offset');
        expect(result.slideIndex).toBe(3, 'slide index');
    });

    it('must align for positive swipe threshold', () => {
        const offset = 0;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 10;
        const viewportWidth = 100;
        const swipeThreshold = 0;
        const swipeDistance = 1;
        const result = calculateActiveSlide(
            [
                ...slides4,
                ...slides4,
                ...slides4,
            ],
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
            swipeDistance,
        );
        expect(result.modifiedOffset).toBe(5, 'normalized offset');
        expect(result.slideIndex).toBe(4, 'slide index');
    });

    it('must align for negative swipe threshold', () => {
        const offset = 1;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 10;
        const viewportWidth = 100;
        const swipeThreshold = 0;
        const swipeDistance = -1;
        const result = calculateActiveSlide(
            [
                ...slides4,
                ...slides4,
                ...slides4,
            ],
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
            swipeDistance,
        );
        expect(result.modifiedOffset).toBe(-5, 'normalized offset');
        expect(result.slideIndex).toBe(5, 'slide index');
    });

    it('must not align for positive swipe threshold', () => {
        const offset = 0;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 10;
        const viewportWidth = 100;
        const swipeThreshold = 0;
        const swipeDistance = -1;
        const result = calculateActiveSlide(
            [
                ...slides4,
                ...slides4,
                ...slides4,
            ],
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
            swipeDistance,
        );
        expect(result.modifiedOffset).toBe(-5, 'normalized offset');
        expect(result.slideIndex).toBe(5, 'slide index');
    });

    it('must not align for negative swipe threshold', () => {
        const offset = 1;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 10;
        const viewportWidth = 100;
        const swipeThreshold = 0;
        const swipeDistance = 1;
        const result = calculateActiveSlide(
            [
                ...slides4,
                ...slides4,
                ...slides4,
            ],
            offset,
            alignMode,
            slideWidth,
            viewportWidth,
            swipeThreshold,
            swipeDistance,
        );
        expect(result.modifiedOffset).toBe(5, 'normalized offset');
        expect(result.slideIndex).toBe(4, 'slide index');
    });

});
