import { CarouselState } from '../../../models/carousel-state';
import { setFirstInitializationProcedure } from './set-first-initialization-procedure';

describe('setFirstInitializationProcedure test suite', () => {

    it('should assign field', () => {
        const state = new CarouselState();
        const result = setFirstInitializationProcedure()({state});
        expect(result.state.initializationState.firstInitalization).toBeTruthy('incorrect first initialization');
    });

});
