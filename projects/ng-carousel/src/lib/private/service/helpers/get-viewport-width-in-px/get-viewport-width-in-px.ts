import { CarouselState } from '../../../models/carousel-state';

/**
 * Width of carousel element in pixels. Try to call this as little as
 * possible, since getting this value triggers layout thrashing.
 */
export function getViewportWidthInPx(state: CarouselState | null): number {
    return state?.widthContainer?.offsetWidth ?? 100;
}
