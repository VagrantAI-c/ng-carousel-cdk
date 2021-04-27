import { CarouselSlide } from '../../../models/carousel-slide';
import { CarouselState } from '../../../models/carousel-state';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../models/test/mock-procedure-environment.const';
import { MOCK_SLIDE_PARAMS } from '../../../models/test/mock-slide-params.const';
import { postponeItemIndexProcedure } from './postpone-item-index-procedure';

describe('postponeItemIndexProcedure test suite', () => {

    it('should break when slides are empty', () => {
        const procedure = postponeItemIndexProcedure(100);
        const state = new CarouselState();
        state.slides = [];
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(result.shouldBreakProcedure).toBeTruthy('procedure is not interrupted');
        expect(result.state.postponedItemIndex).toBe(100, 'postponed index is not assigned');
    });


    it('should not break', () => {
        const procedure = postponeItemIndexProcedure(100);
        const state = new CarouselState();
        state.slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
        ];
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(result.shouldBreakProcedure).toBeFalsy('procedure is interrupted');
        expect(result.state.postponedItemIndex).toBe(null, 'postponed index is assigned');
    });
});
