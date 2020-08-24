import { disableAutoplay } from './disable-autoplay';
import { AutoplaySuspender } from '../../../models/autoplay-suspender';
import { CarouselAutoplay } from '../../../models/carousel-autoplay';
import { NEVER } from 'rxjs';

describe('disableAutoplay test suite', () => {

    it('should create autoplay instance when not provided', () => {
        expect(disableAutoplay(AutoplaySuspender.DRAG) instanceof CarouselAutoplay).toBeTrue();
    });

    it('should unsubscribe from autoplay', () => {
        const autoplay = new CarouselAutoplay();
        autoplay.autoplaySubscription = NEVER.subscribe();
        expect(autoplay.autoplaySubscription.closed).toBeFalse();
        disableAutoplay(AutoplaySuspender.DRAG, autoplay);
        expect(autoplay.autoplaySubscription.closed).toBeTrue();
    });

    it('should not fail when no subscription available', () => {
        expect(() => disableAutoplay(AutoplaySuspender.DRAG, new CarouselAutoplay())).not.toThrow();
    });

    it('should add suspender', () => {
        const autoplay = new CarouselAutoplay();
        expect(autoplay.autoplaySuspenders.size).toBe(0);
        disableAutoplay(AutoplaySuspender.FOCUS, autoplay);
        expect(autoplay.autoplaySuspenders.size).toBe(1);
        expect(Array.from(autoplay.autoplaySuspenders.values())).toEqual([AutoplaySuspender.FOCUS]);
        disableAutoplay(AutoplaySuspender.MOUSE, autoplay);
        expect(autoplay.autoplaySuspenders.size).toBe(2);
        expect(Array.from(autoplay.autoplaySuspenders.values())).toEqual([AutoplaySuspender.FOCUS, AutoplaySuspender.MOUSE]);
    });

});
