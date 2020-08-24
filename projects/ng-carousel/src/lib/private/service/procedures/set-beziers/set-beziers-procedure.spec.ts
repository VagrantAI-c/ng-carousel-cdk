import bezier from 'bezier-easing';

import { CarouselState } from '../../../models/carousel-state';
import { setBeziersProcedure } from './set-beziers-procedure';

describe('setBeziersProcedure test suite', () => {

    it('should assign beziers', () => {
        const state = new CarouselState();
        const result = setBeziersProcedure()({state});
        expect(typeof result.state.dragBezierFn === 'function').toBeTruthy('bezier is not a function');
        expect(typeof result.state.animationBezierFn === 'function').toBeTruthy('bezier is not a function');
        expect(typeof result.state.invertedDragBezierFn === 'function').toBeTruthy('bezier is not a function');
    });

    it('should not assign when instantiated', () => {
        const state = new CarouselState();
        const bezierFn = bezier(1, 1, 1, 1);
        state.dragBezierFn = bezierFn;
        const result = setBeziersProcedure()({state});
        expect(result.state.dragBezierFn).toBe(bezierFn, 'instance changed');
    });

});
