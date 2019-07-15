import { Subscription } from 'rxjs';

import { AutoplaySuspender } from './autoplay-suspender';

/**
 * Autoplay state of current autoplay timer
 */
export class CarouselAutoplay {
    autoplaySuspenders = new Set<AutoplaySuspender>();
    autoplaySubscription: Subscription = null;
}
