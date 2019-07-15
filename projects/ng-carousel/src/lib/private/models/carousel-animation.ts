import { AnimationPlayer } from '@angular/animations';

import { Offset } from './offset';

/**
 * Animation state that is currently in process
 */
export class CarouselAnimation {

    startTime = new Date().getTime();

    constructor(
        public id: number,
        public from: Offset,
        public to: Offset,
        public player: AnimationPlayer,
    ) {
    }

}
