import { CarouselState } from '../../../models/carousel-state';
import { setItemIndexProcedure } from './set-item-index-procedure';

describe('setItemIndexProcedure test suite', () => {

    it('should assign field', () => {
        const state = new CarouselState();
        state.activeItemIndex = 1;
        const procedure = setItemIndexProcedure(4);
        expect(procedure({state}).state.activeItemIndex).toBe(4, 'incorrect index');
    });

});
