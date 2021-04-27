import bezier from 'bezier-easing';

import { CarouselState } from '../../../models/carousel-state';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../models/test/mock-procedure-environment.const';
import { setBeziersProcedure } from './set-beziers-procedure';

describe('setBeziersProcedure test suite', () => {

    it('should assign beziers', () => {
        const state = new CarouselState();
        const result = setBeziersProcedure()({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(typeof result.state.dragBezierFn === 'function').toBeTruthy('bezier is not a function');
        expect(typeof result.state.animationBezierFn === 'function').toBeTruthy('bezier is not a function');
        expect(typeof result.state.invertedDragBezierFn === 'function').toBeTruthy('bezier is not a function');
    });

    it('should not assign when instantiated', () => {
        const state = new CarouselState();
        const bezierFn = bezier(1, 1, 1, 1);
        state.dragBezierFn = bezierFn;
        const result = setBeziersProcedure()({state, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
        expect(result.state.dragBezierFn).toBe(bezierFn, 'instance changed');
    });

});
