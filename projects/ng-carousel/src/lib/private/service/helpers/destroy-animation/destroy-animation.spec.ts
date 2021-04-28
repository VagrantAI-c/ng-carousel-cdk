import { NoopAnimationPlayer } from '@angular/animations';
import { NEVER, Subscription } from 'rxjs';

import { CarouselAnimation } from '../../../models/carousel-animation';
import { destroyAnimation } from './destroy-animation';

describe('destroyAnimation test suite', () => {

    it('should destroy player', () => {
        const animationPlayer = new NoopAnimationPlayer();
        spyOn(animationPlayer, 'finish');
        spyOn(animationPlayer, 'destroy');
        const animation = new CarouselAnimation(
            0,
            0,
            animationPlayer,
            new Subscription(),
        );
        destroyAnimation(animation);
        expect(animationPlayer.destroy).toHaveBeenCalledTimes(1);
        expect(animationPlayer.finish).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe', () => {
        const subscription$ = NEVER.subscribe();
        const animation = new CarouselAnimation(
            0,
            0,
            null,
            subscription$,
        );
        destroyAnimation(animation);
        expect(subscription$.closed).toBeTruthy('subscription not closed');
    });

    it('should not crash upon null animation', () => {
        expect(() => destroyAnimation(null)).not.toThrow();
    });
});
