import { fakeAsync, tick } from '@angular/core/testing';

import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { CarouselAnimation } from '../../../models/carousel-animation';
import { startAnimation } from './start-animation';

describe('startAnimation test suite', () => {

    it('should not run in browserless environment', () => {
        const container = null;
        const from = 0;
        const to = 0;
        const widthMode = CarouselWidthMode.PX;
        const duration = 0;
        const bezierArgs = [0, 0, 0, 0];
        const isBrowser = false;
        const afterAnimationAction = () => {};
        const result = startAnimation(
            container,
            from,
            to,
            widthMode,
            duration,
            bezierArgs,
            isBrowser,
            afterAnimationAction,
        );
        expect(result).toBeNull('result is created');
    });

    it('should create animation instance', () => {
        const container = document ? document.createElement('div') : {} as HTMLElement;
        const from = -20;
        const to = 50;
        const widthMode = CarouselWidthMode.PX;
        const duration = 0;
        const bezierArgs = [0, 0, 0, 0];
        const isBrowser = true;
        const afterAnimationAction = () => {};
        const result = startAnimation(
            container,
            from,
            to,
            widthMode,
            duration,
            bezierArgs,
            isBrowser,
            afterAnimationAction,
        );
        expect(result instanceof CarouselAnimation).toBeTruthy('result is not created');
        expect(result?.player).toBeTruthy('player is not created');
        expect(result?.from).toBe(-20, 'incorrect from value');
        expect(result?.to).toBe(50, 'incorrect to value');
    });
});
