import { fakeAsync, tick } from '@angular/core/testing';
import { interval } from 'rxjs';

import { AutoplaySuspender } from '../../../models/autoplay-suspender';
import { CarouselAutoplay } from '../../../models/carousel-autoplay';
import { enableAutoplay } from './enable-autoplay';

describe('enableAutoplay test suite', () => {

    it('should create autoplay instance', () => {
        const autoplayEnabled = true;
        const transitionDuration = 0;
        const autoplayDelay = 0;
        const isBrowser = true;
        const autoplayAction = () => {};
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
        );
        expect(result instanceof CarouselAutoplay).toBeTruthy('returned instance is not a CarouselAutoplay');
        expect(result.autoplaySuspenders instanceof Set).toBeTruthy('suspenders is not a Set');
    });

    it('should clear previous autoplay subscription', () => {
        const autoplayEnabled = false;
        const transitionDuration = 0;
        const autoplayDelay = 0;
        const isBrowser = true;
        const autoplayAction = () => {};
        const suspender = null;
        const existingAutoplay = new CarouselAutoplay();
        existingAutoplay.autoplaySubscription = interval(100).subscribe();
        expect(existingAutoplay.autoplaySubscription.closed).toBeFalsy('prematurely closed subscription');
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(existingAutoplay.autoplaySubscription.closed).toBeTruthy('subscription is not closed');
        expect(result.autoplaySubscription).toBe(existingAutoplay.autoplaySubscription, 'subscription is re-created');
    });

    it('should delete suspender', () => {
        const autoplayEnabled = false;
        const transitionDuration = 0;
        const autoplayDelay = 0;
        const isBrowser = true;
        const autoplayAction = () => {};
        const suspender = AutoplaySuspender.FOCUS;
        const existingAutoplay = new CarouselAutoplay();
        existingAutoplay.autoplaySuspenders = new Set<AutoplaySuspender>([AutoplaySuspender.FOCUS]);
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(result.autoplaySuspenders.has(AutoplaySuspender.FOCUS)).toBeFalsy('suspender is not removed');
    });

    it('should not delete suspender', () => {
        const autoplayEnabled = false;
        const transitionDuration = 0;
        const autoplayDelay = 0;
        const isBrowser = true;
        const autoplayAction = () => {};
        const suspender = AutoplaySuspender.DRAG;
        const existingAutoplay = new CarouselAutoplay();
        existingAutoplay.autoplaySuspenders = new Set<AutoplaySuspender>([AutoplaySuspender.FOCUS]);
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(result.autoplaySuspenders.has(AutoplaySuspender.FOCUS)).toBeTruthy('suspender is deleted');
        expect(result.autoplaySuspenders.size).toBe(1, 'suspenders are mutated unexpectedly');
    });

    it('should not set interval when suspenders available', () => {
        const autoplayEnabled = true;
        const transitionDuration = 0;
        const autoplayDelay = 0;
        const isBrowser = true;
        const autoplayAction = () => {};
        const suspender = null;
        const existingAutoplay = new CarouselAutoplay();
        existingAutoplay.autoplaySuspenders = new Set<AutoplaySuspender>([AutoplaySuspender.FOCUS]);
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(result.autoplaySubscription).toBe(existingAutoplay.autoplaySubscription, 'subscription is created');
    });

    it('should not set interval when autoplay is disabled', () => {
        const autoplayEnabled = false;
        const transitionDuration = 0;
        const autoplayDelay = 0;
        const isBrowser = true;
        const autoplayAction = () => {};
        const suspender = null;
        const existingAutoplay = new CarouselAutoplay();
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(result.autoplaySubscription).toBe(existingAutoplay.autoplaySubscription, 'subscription is created');
    });

    it('should not set interval in browserless environment', () => {
        const autoplayEnabled = true;
        const transitionDuration = 0;
        const autoplayDelay = 0;
        const isBrowser = false;
        const autoplayAction = () => {};
        const suspender = null;
        const existingAutoplay = new CarouselAutoplay();
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(result.autoplaySubscription).toBe(existingAutoplay.autoplaySubscription, 'subscription is created');
    });

    it('should set interval', () => {
        const autoplayEnabled = true;
        const transitionDuration = 0;
        const autoplayDelay = 100;
        const isBrowser = true;
        const autoplayAction = () => {};
        const suspender = null;
        const existingAutoplay = new CarouselAutoplay();
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(result.autoplaySubscription).toBeTruthy('subscription is not created');
        expect(result.interval).toBe(100, 'incorrect interval');

        // Cleanup
        result.autoplaySubscription?.unsubscribe();
    });

    it('should apply interval callback', fakeAsync(() => {
        const autoplayEnabled = true;
        const transitionDuration = 0;
        const autoplayDelay = 200;
        const isBrowser = true;
        const autoplayActionObject = {action: () => {}};
        spyOn(autoplayActionObject, 'action');
        const suspender = null;
        const existingAutoplay = new CarouselAutoplay();
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayActionObject.action,
            suspender,
            existingAutoplay,
        );
        expect(result.autoplaySubscription).toBeTruthy('subscription is not created');
        expect(result.interval).toBe(200, 'incorrect interval');
        tick(result.interval!); // We asserted it non null on previous line
        expect(autoplayActionObject.action).toHaveBeenCalledTimes(1);

        // Cleanup

        result.autoplaySubscription?.unsubscribe();
    }));

    it('should align interval', () => {
        const autoplayEnabled = true;
        const transitionDuration = 200;
        const autoplayDelay = 100;
        const isBrowser = true;
        const autoplayAction = () => {};
        const suspender = null;
        const existingAutoplay = new CarouselAutoplay();
        const result = enableAutoplay(
            autoplayEnabled,
            transitionDuration,
            autoplayDelay,
            isBrowser,
            autoplayAction,
            suspender,
            existingAutoplay,
        );
        expect(result.interval).toBe(200, 'incorrect interval');

        // Cleanup
        result.autoplaySubscription?.unsubscribe();
    });

});
