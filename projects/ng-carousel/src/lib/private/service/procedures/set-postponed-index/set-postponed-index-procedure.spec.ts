import { CarouselState } from '../../../models/carousel-state';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { setPostponedIndexProcedure } from './set-postponed-index-procedure';
import { CarouselSlide } from '../../../models/carousel-slide';
import { ComposedProcedure } from '../../../models/procedure/composed-procedure.type';

describe('setPostponedIndexProcedure test suite', () => {

    it('should continue when postponed index unavailable', () => {
        const procedure = setPostponedIndexProcedure();
        const state = new CarouselState();
        const result = procedure({state, environment: {}, procedureState: {}});
        expect(typeof result === 'object').toBeTruthy('result is a higher order procedure');
        expect((result as ProcedureHandler).shouldBreakProcedure).toBeFalsy('procedure not continuing');
        expect((result as ProcedureHandler).state).toBe(state, 'state instance changed');
    });

    it('should return another procedure when index postponed', () => {
        const procedure = setPostponedIndexProcedure();
        const state = new CarouselState();
        state.postponedItemIndex = 3;
        state.slides = [
            new CarouselSlide(0, 0),
            new CarouselSlide(1, 1),
            new CarouselSlide(2, 2),
            new CarouselSlide(3, 3),
        ];
        const result = procedure({state, environment: {}, procedureState: {}});
        expect(typeof result === 'function').toBeTruthy('result is a handler');
        const decomposedResult = (result as ComposedProcedure)({state, environment: {}, procedureState: {}}) as ProcedureHandler;
        expect(decomposedResult.shouldBreakProcedure).toBeFalsy('procedure not continuing');
        expect(decomposedResult.state.postponedItemIndex).toBeNull('postponed item index persists');
    });

});
