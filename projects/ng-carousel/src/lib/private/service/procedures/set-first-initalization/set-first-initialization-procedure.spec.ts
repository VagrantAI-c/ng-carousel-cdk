import { CarouselState } from '../../../models/carousel-state';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../models/test/mock-procedure-environment.const';
import { setFirstInitializationProcedure } from './set-first-initialization-procedure';

describe('setFirstInitializationProcedure test suite', () => {

    it('should assign field', () => {
        const state = new CarouselState();
        const result = setFirstInitializationProcedure()({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(result.state.initializationState.firstInitalization).toBeTruthy('incorrect first initialization');
    });

});
