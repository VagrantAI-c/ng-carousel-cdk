import { CarouselSlide } from '../../../models/carousel-slide';
import { CarouselState } from '../../../models/carousel-state';
import { ComposedProcedure } from '../../../models/procedure/composed-procedure.type';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../models/test/mock-procedure-environment.const';
import { MOCK_SLIDE_PARAMS } from '../../../models/test/mock-slide-params.const';
import { goToInitialIndexProcedure } from './go-to-initial-index-procedure';

describe('goToInitialIndexProcedure test suite', () => {

    it('should initialize within a range', () => {
        const procedure = goToInitialIndexProcedure();
        const state = new CarouselState();
        state.config.initialIndex = () => 2;
        state.config.items = [1, 2, 3];
        state.slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
        ];
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ComposedProcedure;
        expect(typeof result === 'function').toBeTruthy('result is a handler');
        const decomposedResult = result({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ProcedureHandler;
        expect(decomposedResult.shouldBreakProcedure).toBeFalsy('procedure not continuing');
        expect(decomposedResult.state.activeItemIndex).toBe(2, 'incorrect item index');
    });

    it('should ceil to 0', () => {
        const procedure = goToInitialIndexProcedure();
        const state = new CarouselState();
        state.config.initialIndex = () => -1;
        state.config.items = [1, 2, 3];
        state.slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
        ];
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ComposedProcedure;
        expect(typeof result === 'function').toBeTruthy('result is a handler');
        const decomposedResult = result({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ProcedureHandler;
        expect(decomposedResult.state.activeItemIndex).toBe(0, 'incorrect item index');
    });

    it('should floor to items length', () => {
        const procedure = goToInitialIndexProcedure();
        const state = new CarouselState();
        state.config.initialIndex = () => 100;
        state.config.items = [1, 2, 3];
        state.slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
        ];
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ComposedProcedure;
        expect(typeof result === 'function').toBeTruthy('result is a handler');
        const decomposedResult = result({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ProcedureHandler;
        expect(decomposedResult.state.activeItemIndex).toBe(2, 'incorrect item index');
    });

    it('should continue when postponed index unavailable', () => {
        const procedure = goToInitialIndexProcedure();
        const state = new CarouselState();
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(typeof result === 'object').toBeTruthy('result is a higher order procedure');
        expect((result as ProcedureHandler).shouldBreakProcedure).toBeFalsy('procedure not continuing');
        expect((result as ProcedureHandler).state).toBe(state, 'state instance changed');
    });

    it('should return another procedure when index postponed', () => {
        const procedure = goToInitialIndexProcedure();
        const state = new CarouselState();
        state.postponedItemIndex = 3;
        state.slides = [
            new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
            new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
            new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
            new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
        ];
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ComposedProcedure;
        expect(typeof result === 'function').toBeTruthy('result is a handler');
        const decomposedResult = result({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}}) as ProcedureHandler;
        expect(decomposedResult.shouldBreakProcedure).toBeFalsy('procedure not continuing');
        expect(decomposedResult.state.postponedItemIndex).toBeNull('postponed item index persists');
    });

});
