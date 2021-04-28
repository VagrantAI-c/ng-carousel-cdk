import { CompleteCarouselConfig } from '../../../models/carousel-config';
import { CarouselState } from '../../../models/carousel-state';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../models/test/mock-procedure-environment.const';
import { setConfigProcedure } from './set-config-procedure';

describe('setConfigProcedure test suite', () => {

    it('should assign fields', () => {
        const carouselConfig = new CompleteCarouselConfig();
        const state = new CarouselState();
        expect(state.initializationState.configInitialized).toBeFalsy('config initialized prematurely');
        const result = setConfigProcedure(carouselConfig)({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(result.state.initializationState.configInitialized).toBeTruthy('incorrect config state');
        expect(result.state.config).toBe(carouselConfig, 'incorrect config');
    });

});
