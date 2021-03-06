import { CarouselConfig } from '../../../../carousel-config';
import { CarouselState } from '../../../models/carousel-state';
import { setConfigProcedure } from './set-config-procedure';

describe('setConfigProcedure test suite', () => {

    it('should assign fields', () => {
        const carouselConfig = new CarouselConfig();
        const state = new CarouselState();
        expect(state.initializationState.configInitialized).toBeFalsy('config initialized prematurely');
        const result = setConfigProcedure(carouselConfig)({state, environment: {}, procedureState: {}});
        expect(result.state.initializationState.configInitialized).toBeTruthy('incorrect config state');
        expect(result.state.config).toBe(carouselConfig, 'incorrect config');
    });

});
