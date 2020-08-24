import { CarouselState } from '../../../models/carousel-state';
import { getViewportWidth } from './get-viewport-width';
import { CarouselWidthMode } from '../../../../carousel-width-mode';

describe('getViewportWidth test suite', () => {

    it('should return width in px', () => {
        const state = new CarouselState();
        state.widthContainer = {offsetWidth: 21};
        state.config.widthMode = CarouselWidthMode.PX;
        expect(getViewportWidth(state)).toBe(21, 'incorrect px width');
    });

    it('should return width in percents', () => {
        const state = new CarouselState();
        state.config.widthMode = CarouselWidthMode.PERCENT;
        expect(getViewportWidth(state)).toBe(100, 'incorrect % width');
    });

    it('should return default value upon undefined fields', () => {
        const state = new CarouselState();
        delete state.config.widthMode;
        expect(getViewportWidth(state)).toBe(100, 'incorrect default width');
        expect(getViewportWidth(null)).toBe(100, 'incorrect default width');
    });

});
