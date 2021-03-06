import { CarouselState } from '../../../models/carousel-state';
import { postponeInitializationProcedure } from './postpone-initialization-procedure';

describe('postponeInitializationProcedure test suite', () => {

    it('should continue procedure', () => {
        const procedure = postponeInitializationProcedure();
        const state = new CarouselState();
        const result = procedure({state, environment: {}, procedureState: {}});
        expect(result.shouldBreakProcedure).toBeTruthy('procedure is not interrupted');
        expect(result.state).toBe(state, 'instance changed');
    });

    it('should break procedure', () => {
        const procedure = postponeInitializationProcedure();
        const state = new CarouselState();
        state.initializationState.viewportWidthInitialized = true;
        state.initializationState.configInitialized = true;
        const result = procedure({state, environment: {}, procedureState: {}});
        expect(result.shouldBreakProcedure).toBeFalsy('procedure is interrupted');
        expect(result.state).toBe(state, 'instance changed');
    });

});
