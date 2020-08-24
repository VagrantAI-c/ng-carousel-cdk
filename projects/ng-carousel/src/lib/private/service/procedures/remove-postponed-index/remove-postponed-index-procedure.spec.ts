import { removePostponedIndexProcedure } from './remove-postponed-index-procedure';
import { CarouselState } from '../../../models/carousel-state';

describe('removePostponedIndexProcedure test suite', () => {

    it('should nullify field', () => {
        const procedure = removePostponedIndexProcedure();
        const state = new CarouselState();
        state.postponedItemIndex = 3;
        const result = procedure({state});
        expect(result.state.postponedItemIndex).toBe(null, 'field not reset');
    });

});