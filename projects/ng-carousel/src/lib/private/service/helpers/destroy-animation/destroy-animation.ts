import { CarouselAnimation } from '../../../models/carousel-animation';

/**
 * Destroys animation player without callback
 */
export function destroyAnimation(
    animation?: CarouselAnimation | null,
): void {
    try {
        animation?.player?.finish();
        animation?.player?.destroy();
    // Ignore exception since player might be already destroyed
    // at this moment
    } catch (e) {}
    animation?.onDoneSubscription$?.unsubscribe();
}
