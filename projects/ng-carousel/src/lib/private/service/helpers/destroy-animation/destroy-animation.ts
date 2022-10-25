import { CarouselAnimation } from '../../../models/carousel-animation';

/**
 * Destroys animation player without callback
 */
export function destroyAnimation(
    animation?: CarouselAnimation | null,
): void {
    animation?.player?.cancel();
}
