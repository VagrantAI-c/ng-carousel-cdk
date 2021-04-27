import { CarouselState } from '../../../models/carousel-state';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../models/test/mock-procedure-environment.const';
import { removePostponedIndexProcedure } from './remove-postponed-index-procedure';

describe('removePostponedIndexProcedure test suite', () => {

    it('should nullify field', () => {
        const procedure = removePostponedIndexProcedure();
        const state = new CarouselState();
        state.postponedItemIndex = 3;
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(result.state.postponedItemIndex).toBe(null, 'field not reset');
    });

});
