import { getNextIndex } from './get-next-index';

describe('getNextIndex test suite', () => {

    it('should change index', () => {
        const slidesLength = 4;
        const activeSlideIndex = 2;
        const shouldLoop = true;
        const result = getNextIndex(slidesLength, activeSlideIndex, shouldLoop);
        expect(result).toBe(3);
    });

    it('should jump to first slide', () => {
        const slidesLength = 10;
        const activeSlideIndex = 9;
        const shouldLoop = true;
        const result = getNextIndex(slidesLength, activeSlideIndex, shouldLoop);
        expect(result).toBe(0);
    });

    it('should stay on last slide', () => {
        const slidesLength = 10;
        const activeSlideIndex = 9;
        const shouldLoop = false;
        const result = getNextIndex(slidesLength, activeSlideIndex, shouldLoop);
        expect(result).toBe(9);
    });
});
