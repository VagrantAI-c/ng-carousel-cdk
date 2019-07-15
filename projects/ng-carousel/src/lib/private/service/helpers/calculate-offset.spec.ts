import { calculateOffset } from './calculate-offset';
import { CarouselAlignMode } from '../../../carousel-align-mode';

describe('calculateOffset suite', () => {

    it('common case with left alignment of first slide', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 30;
        const viewportWidth = 80;
        const slidesLength = 0; // Unimportant
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(0);
    });

    it('common case with left alignment', () => {
        const currentSlideIndex = 3;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 40;
        const viewportWidth = 100;
        const slidesLength = 0; // Unimportant
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(-120);
    });

    it('common case with center alignment of first slide', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 40;
        const viewportWidth = 200;
        const slidesLength = 0; // Unimportant
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(80);
    });

    it('common case with center alignment', () => {
        const currentSlideIndex = 5;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 50;
        const viewportWidth = 100;
        const slidesLength = 0; // Unimportant
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(-225);
    });

    it('edge case with slide width larger than viewport and center alignment', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.CENTER;
        const slideWidth = 100;
        const viewportWidth = 80;
        const slidesLength = 0; // Unimportant
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(-10);
    });

    it('edge case with slide width larger than viewport and left alignment', () => {
        const currentSlideIndex = 0;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 300;
        const viewportWidth = 10;
        const slidesLength = 0; // Unimportant
        const shouldLoop = true;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(0);
    });

    it('must calculate offset with loop disabled with overflowing slides', () => {
        const currentSlideIndex = 2;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 50;
        const viewportWidth = 100;
        const slidesLength = 3;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(-50);
    });

    it('must calculate offset with loop disabled with all slides visible', () => {
        const currentSlideIndex = 2;
        const alignMode = CarouselAlignMode.LEFT;
        const slideWidth = 10;
        const viewportWidth = 100;
        const slidesLength = 3;
        const shouldLoop = false;
        const result = calculateOffset(
            currentSlideIndex,
            alignMode,
            slideWidth,
            viewportWidth,
            slidesLength,
            shouldLoop,
        );
        expect(result).toBe(0);
    });

});
