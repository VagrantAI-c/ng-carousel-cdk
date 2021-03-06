import { CarouselState } from '../../../models/carousel-state';
import { postponeDragEnabledProcedure } from './postpone-drag-enabled-procedure';

describe('postponeDragEnabledProcedure test suite', () => {

    it('should continue if drag enabled', () => {
        const procedure = postponeDragEnabledProcedure();
        const state = new CarouselState();
        state.config.dragEnabled = true;
        const result = procedure({state, environment: {}, procedureState: {}});
        expect(result.shouldBreakProcedure).toBeFalsy('procedure is interrupted');
    });

    it('should break when drag disabled', () => {
        const procedure = postponeDragEnabledProcedure();
        const state = new CarouselState();
        state.config.dragEnabled = false;
        const result = procedure({state, environment: {}, procedureState: {}});
        expect(result.shouldBreakProcedure).toBeTruthy('procedure is not interrupted');
    });

});
