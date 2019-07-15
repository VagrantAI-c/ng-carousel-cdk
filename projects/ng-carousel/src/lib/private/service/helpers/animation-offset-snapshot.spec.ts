
import * as BezierEasing from 'bezier-easing';

import { animationOffsetSnapshot } from './animation-offset-snapshot';

describe('animationOffsetSnapshot test suite', () => {

    // Imitate linear function so we can predict results
    const bezierFn = BezierEasing(0, 0, 1, 1);

    it('must calculate common pattern', () => {
        const currentDuration = 50;
        const totalDuration = 100;
        const from = 0;
        const to = 100;
        const result = animationOffsetSnapshot(
            currentDuration,
            totalDuration,
            from,
            to,
            bezierFn,
        );
        expect(result).toBe(50);
    });

    it('must calculate negative distance', () => {
        const currentDuration = 50;
        const totalDuration = 100;
        const from = 100;
        const to = 0;
        const result = animationOffsetSnapshot(
            currentDuration,
            totalDuration,
            from,
            to,
            bezierFn,
        );
        expect(result).toBe(50);
    });

    it('must calculate for noop animation', () => {
        const currentDuration = 50;
        const totalDuration = 0;
        const from = 0;
        const to = 100;
        const result = animationOffsetSnapshot(
            currentDuration,
            totalDuration,
            from,
            to,
            bezierFn,
        );
        expect(result).toBe(to);
    });

    it('must calculate for equal from and to', () => {
        const currentDuration = 50;
        const totalDuration = 0;
        const from = 100;
        const to = 100;
        const result = animationOffsetSnapshot(
            currentDuration,
            totalDuration,
            from,
            to,
            bezierFn,
        );
        expect(result).toBe(to);
    });

    it('must calculate for incorrect parameters', () => {
        const currentDuration = -50;
        const totalDuration = 100;
        const from = 0;
        const to = 100;
        const result = animationOffsetSnapshot(
            currentDuration,
            totalDuration,
            from,
            to,
            bezierFn,
        );
        expect(result).toBe(to);
    });

    it('must calculate common difficult pattern', () => {
        const currentDuration = 1245;
        const totalDuration = 2500;
        const from = 80;
        const to = -25;
        const result = animationOffsetSnapshot(
            currentDuration,
            totalDuration,
            from,
            to,
            bezierFn,
        );
        expect(result).toBe(27.71);
    });

});
