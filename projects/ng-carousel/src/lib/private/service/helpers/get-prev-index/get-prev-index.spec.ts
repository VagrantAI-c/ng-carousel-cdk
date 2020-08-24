import { getPrevIndex } from './get-prev-index';

describe('getPrevIndex test suite', () => {

    it('should change index', () => {
        const slidesLength = 4;
        const activeSlideIndex = 3;
        const shouldLoop = true;
        const result = getPrevIndex(slidesLength, activeSlideIndex, shouldLoop);
        expect(result).toBe(2);
    });

    it('should jump to last slide', () => {
        const slidesLength = 10;
        const activeSlideIndex = 0;
        const shouldLoop = true;
        const result = getPrevIndex(slidesLength, activeSlideIndex, shouldLoop);
        expect(result).toBe(9);
    });

    it('should stay on first slide', () => {
        const slidesLength = 10;
        const activeSlideIndex = 0;
        const shouldLoop = false;
        const result = getPrevIndex(slidesLength, activeSlideIndex, shouldLoop);
        expect(result).toBe(0);
    });
});
