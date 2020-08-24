import { AutoplaySuspender } from '../../../models/autoplay-suspender';
import { CarouselAutoplay } from '../../../models/carousel-autoplay';

/** Stops autoplay timer, provides side effect for provided autoplay */
export function disableAutoplay(
    suspender: AutoplaySuspender,
    autoplay: CarouselAutoplay = new CarouselAutoplay(),
): CarouselAutoplay {
    autoplay?.autoplaySubscription?.unsubscribe();
    if (!autoplay.autoplaySuspenders) {
        autoplay.autoplaySuspenders = new Set<AutoplaySuspender>();
    }
    autoplay.autoplaySuspenders.add(suspender);

    return autoplay;
}
