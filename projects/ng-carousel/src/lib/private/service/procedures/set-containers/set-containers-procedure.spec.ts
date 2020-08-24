import { CarouselState } from '../../../models/carousel-state';
import { setContainersProcedure } from './set-containers-procedure';

describe('setContainersProcedure test suite', () => {

    it('should assign properties', () => {
        const widthContainer = {} as HTMLElement;
        const animatableContainer = {} as HTMLElement;
        const state = new CarouselState();
        expect(state.initializationState.viewportWidthInitialized).toBeFalsy('viewport width initialized prematurely');
        const result = setContainersProcedure(widthContainer, animatableContainer)({state});
        expect(result.state.initializationState.viewportWidthInitialized).toBeTruthy('incorrect viewport width state');
        expect(result.state.widthContainer).toBe(widthContainer, 'incorrect width container');
        expect(result.state.animatableContainer).toBe(animatableContainer, 'incorrect animatable container');
    });

});
