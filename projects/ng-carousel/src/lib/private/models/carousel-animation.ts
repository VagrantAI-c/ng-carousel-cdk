import { AnimationPlayer } from '@angular/animations';
import { Subscription } from 'rxjs';

/**
 * Animation state that is currently in process
 */
export class CarouselAnimation {

    constructor(
        public from: number,
        public to: number,
        public player?: AnimationPlayer,
        public onDoneSubscription$?: Subscription,
        public startTime = new Date().getTime(),
    ) {
    }

}
