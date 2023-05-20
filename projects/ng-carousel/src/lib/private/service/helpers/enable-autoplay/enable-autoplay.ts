import { NgZone } from '@angular/core';
import { interval } from 'rxjs';

import { AutoplaySuspender } from '../../../models/autoplay-suspender';
import { CarouselAutoplay } from '../../../models/carousel-autoplay';

/** Starts carousel autoplay whether one is enabled */
export function enableAutoplay(
    autoplayEnabled: boolean,
    transitionDuration: number,
    autoplayDelay: number,
    isBrowser: boolean,
    autoplayAction: () => void,
    suspender?: AutoplaySuspender | null,
    autoplay?: CarouselAutoplay,
    zone?: NgZone,
): CarouselAutoplay {
    if (!autoplay) {
        autoplay = new CarouselAutoplay();
    }
    autoplay.autoplaySubscription?.unsubscribe();
    if (!autoplay.autoplaySuspenders) {
        autoplay.autoplaySuspenders = new Set<AutoplaySuspender>();
    }
    if (suspender) {
        autoplay.autoplaySuspenders.delete(suspender);
    }
    if (autoplayEnabled && !autoplay.autoplaySuspenders.size && isBrowser) {
        // Delay can't be smaller than transition itself in order to avoid endless animation
        const autoplayInterval = Math.max(transitionDuration, autoplayDelay);
        autoplay.interval = autoplayInterval;
        if (zone) {
            zone.runOutsideAngular(() => {
                if (autoplay) {
                    autoplay.autoplaySubscription = interval(autoplayInterval).subscribe(autoplayAction);
                }
            });
        } else {
            autoplay.autoplaySubscription = interval(autoplay.interval).subscribe(autoplayAction);
        }
    }

    return autoplay;
}
