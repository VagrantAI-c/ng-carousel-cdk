import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { calculateOffset } from './calculate-offset';

describe('calculateOffset suite', () => {

    it('common case with left alignment of first slide', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 30;
        const viewportWidth = 80;
        const slideQuantity = 0; // Unrelated to test
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(0, 'incorrect offset');
    });

    it('common case with left alignment of first slide and threshold', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 30;
        const viewportWidth = 80;
        const slideQuantity = 0; // Unrelated to test
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(0, 'incorrect offset');
    });

    it('common case with left alignment', () => {
        const currentSlideIndex = 3;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 40;
        const viewportWidth = 100;
        const slideQuantity = 0; // Unrelated to test
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-120, 'incorrect offset');
    });

    it('common case with center alignment of first slide', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 40;
        const viewportWidth = 200;
        const slideQuantity = 0; // Unrelated to test
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(80, 'incorrect offset');
    });

    it('common case with center alignment', () => {
        const currentSlideIndex = 5;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 50;
        const viewportWidth = 100;
        const slideQuantity = 0; // Unrelated to test
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-225, 'incorrect offset');
    });

    it('edge case with slide width larger than viewport and center alignment', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 100;
        const viewportWidth = 80;
        const slideQuantity = 0; // Unrelated to test
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-10, 'incorrect offset');
    });

    it('edge case with slide width larger than viewport and left alignment', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 300;
        const viewportWidth = 10;
        const slideQuantity = 0; // Unrelated to test
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(0, 'incorrect offset');
    });

    it('must calculate offset with loop disabled with overflowing slides', () => {
        const currentSlideIndex = 2;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 50;
        const viewportWidth = 100;
        const slideQuantity = 3;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-50, 'incorrect offset');
    });

    it('must calculate offset with loop disabled with overflowing slides and threshold', () => {
        const currentSlideIndex = 2;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 50;
        const viewportWidth = 100;
        const slideQuantity = 3;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-50, 'incorrect offset');
    });

    it('must calculate offset with loop disabled with all slides visible', () => {
        const currentSlideIndex = 2;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 10;
        const viewportWidth = 100;
        const slideQuantity = 3;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(0, 'incorrect offset');
    });

    it('must calculate range with slides both visible and invisible', () => {
        const currentSlideIndex = 2;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 30;
        const viewportWidth = 100;
        const slideQuantity = 20;
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-25, 'incorrect offset');
    });

    it('must calculate range with slides both visible and invisible and threshold', () => {
        const currentSlideIndex = 2;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 30;
        const viewportWidth = 100;
        const slideQuantity = 20;
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-25, 'incorrect offset');
    });

    it('must calculate range for non-loop left alignment and all slides visible', () => {
        const currentSlideIndex = 3;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 2;
        const viewportWidth = 100;
        const slideQuantity = 10;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(0, 'incorrect offset');
    });

    it('must calculate range for non-loop left alignment and right edge visible', () => {
        const currentSlideIndex = 9;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 20;
        const viewportWidth = 100;
        const slideQuantity = 10;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-100, 'incorrect offset');
    });

    it('must calculate range for non-loop left alignment and right edge visible and threshold', () => {
        const currentSlideIndex = 9;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 20;
        const viewportWidth = 100;
        const slideQuantity = 10;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-100, 'incorrect offset');
    });

    it('must round for fractional offsets', () => {
        const currentSlideIndex = 1;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 60;
        const viewportWidth = 101;
        const slideQuantity = 3;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slideQuantity,
            shouldLoop,
        );
        expect(result.offset).toBe(-39, 'incorrect offset'); // Would be -39.5 without rounding
    });
});
