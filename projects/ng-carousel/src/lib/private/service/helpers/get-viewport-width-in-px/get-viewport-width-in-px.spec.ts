import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { getViewportWidthInPx } from './get-viewport-width-in-px';
import { CarouselState } from '../../../models/carousel-state';

describe('getViewportWidthInPx test suite', () => {

    it('should return width in px', () => {
        const state = new CarouselState();
        state.widthContainer = {offsetWidth: 555};
        state.config.widthMode = CarouselWidthMode.PX;
        expect(getViewportWidthInPx(state)).toBe(555, 'incorrect px width');
    });

    it('should return default value upon undefined state', () => {
        const state = new CarouselState();
        expect(getViewportWidthInPx(state)).toBe(100, 'incorrect default width');
        expect(getViewportWidthInPx(null)).toBe(100, 'incorrect default width');
    });

});
