import { EasingFunction } from 'bezier-easing';

/**
 * Calculates offset for animation specific tick
 */
export function animationOffsetSnapshot(
    currentPosition: number,
    totalDuration: number,
    from: number,
    to: number,
    offsetFallback: number,
    bezierFn: EasingFunction,
): number {
    if (typeof from === 'undefined' || typeof to === 'undefined') {

        return offsetFallback;
    }
    if (totalDuration <= 0 || currentPosition < 0 || to === from) {

        return to;
    }
    const animationDistance = Math.abs(to - from);
    const completedDistancePercent = currentPosition / totalDuration;
    const completedDistance = animationDistance * bezierFn(completedDistancePercent);
    const offsetSnapshot = to > from
        ? from + completedDistance
        : from - completedDistance;

    return offsetSnapshot;
}
