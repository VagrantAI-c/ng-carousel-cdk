import { CarouselState } from '../../../models/carousel-state';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../models/test/mock-procedure-environment.const';
import { setContainersProcedure } from './set-containers-procedure';

describe('setContainersProcedure test suite', () => {

    it('should assign properties', () => {
        const widthContainer = {} as HTMLElement;
        const animatableContainer = {} as HTMLElement;
        const state = new CarouselState();
        expect(state.initializationState.viewportWidthInitialized).toBeFalsy('viewport width initialized prematurely');
        const procedure = setContainersProcedure(widthContainer, animatableContainer);
        const result = procedure({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(result.state.initializationState.viewportWidthInitialized).toBeTruthy('incorrect viewport width state');
        expect(result.state.widthContainer).toBe(widthContainer, 'incorrect width container');
        expect(result.state.animatableContainer).toBe(animatableContainer, 'incorrect animatable container');
    });

});
