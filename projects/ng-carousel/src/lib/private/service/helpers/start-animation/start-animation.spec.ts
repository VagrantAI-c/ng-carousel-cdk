import { AnimationBuilder, AnimationFactory, AnimationPlayer, NoopAnimationPlayer } from '@angular/animations';
import { fakeAsync, tick } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { CarouselAnimation } from '../../../models/carousel-animation';
import { startAnimation } from './start-animation';

describe('startAnimation test suite', () => {

    class MockAnimationFactory extends AnimationFactory {
        create(): AnimationPlayer {
            return new NoopAnimationPlayer();
        }
    }

    class MockAnimationBuilder extends AnimationBuilder {
        build(): AnimationFactory {
            return new MockAnimationFactory();
        }
    }

    let animationBuilder: AnimationBuilder;

    beforeEach(() => {
        animationBuilder = new MockAnimationBuilder();
    });

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
            animationBuilder,
        );
        expect(result).toBeNull('result is created');
    });

    it('should create animation instance', () => {
        const container = {} as HTMLElement;
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
            animationBuilder,
        );
        expect(result instanceof CarouselAnimation).toBeTruthy('result is not created');
        expect(result?.onDoneSubscription$ instanceof Subscription).toBeTruthy('subscription is not Subscription');
        expect(result?.player).toBeTruthy('player is not created');
        expect(result?.from).toBe(-20, 'incorrect from value');
        expect(result?.to).toBe(50, 'incorrect to value');

        // Cleanup
        result?.onDoneSubscription$?.unsubscribe();
    });

    it('should emit onDone', fakeAsync(() => {
        const container = {} as HTMLElement;
        const from = 0;
        const to = 0;
        const widthMode = CarouselWidthMode.PX;
        const duration = 0;
        const bezierArgs = [0, 0, 0, 0];
        const isBrowser = true;
        const afterAnimationActionObject = {action: () => {}};
        spyOn(afterAnimationActionObject, 'action');
        const result = startAnimation(
            container,
            from,
            to,
            widthMode,
            duration,
            bezierArgs,
            isBrowser,
            afterAnimationActionObject.action,
            animationBuilder,
        );
        tick();
        expect(afterAnimationActionObject.action).toHaveBeenCalledTimes(1);

        // Cleanup
        result?.onDoneSubscription$?.unsubscribe();
    }));
});
