import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { CarouselState } from '../../../models/carousel-state';
import { getViewportWidthInPx } from '../get-viewport-width-in-px/get-viewport-width-in-px';

/**
 * Width of carousel element in current width mode.
 * Try to call this as little as possible, since getting this value
 * triggers layout thrashing.
 */
export function getViewportWidth(state: CarouselState): number {
    return state?.config?.widthMode === CarouselWidthMode.PX
        ? getViewportWidthInPx(state)
        : 100;
}