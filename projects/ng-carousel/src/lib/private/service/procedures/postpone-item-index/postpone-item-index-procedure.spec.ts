import { CarouselSlide } from '../../../models/carousel-slide';
import { CarouselState } from '../../../models/carousel-state';
import { postponeItemIndexProcedure } from './postpone-item-index-procedure';

describe('postponeItemIndexProcedure test suite', () => {

    it('should break when no slides available', () => {
        const procedure = postponeItemIndexProcedure(100);
        const state = new CarouselState();
        state.slides = null;
        const result = procedure({state});
        expect(result.shouldBreakProcedure).toBeTruthy('procedure is not interrupted');
        expect(result.state.postponedItemIndex).toBe(100, 'postponed index is not assigned');
    });

    it('should break when slides are empty', () => {
        const procedure = postponeItemIndexProcedure(100);
        const state = new CarouselState();
        state.slides = [];
        const result = procedure({state});
        expect(result.shouldBreakProcedure).toBeTruthy('procedure is not interrupted');
        expect(result.state.postponedItemIndex).toBe(100, 'postponed index is not assigned');
    });


    it('should not break', () => {
        const procedure = postponeItemIndexProcedure(100);
        const state = new CarouselState();
        state.slides = [
            new CarouselSlide(0, 0),
        ];
        const result = procedure({state});
        expect(result.shouldBreakProcedure).toBeFalsy('procedure is interrupted');
        expect(result.state.postponedItemIndex).toBe(null, 'postponed index is assigned');
    });
});
