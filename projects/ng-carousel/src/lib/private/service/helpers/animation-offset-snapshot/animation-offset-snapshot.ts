import { EasingFunction } from 'bezier-easing';

/**
 * Calculates offset for animation specific tick
 */
export function animationOffsetSnapshot(
    currentPosition: number,
    totalDuration: number,
    from: number | null,
    to: number | null,
    offsetFallback: number,
    bezierFn: EasingFunction | null,
): number {
    if (from === null || to === null) {

        return offsetFallback;
    }
    if (totalDuration <= 0 || currentPosition < 0 || to === from) {

        return to;
    }
    if (!bezierFn) {

        return from;
    }
    const animationDistance = Math.abs(to - from);
    const completedDistancePercent = currentPosition / totalDuration;
    const completedDistance = animationDistance * bezierFn(completedDistancePercent);
    const offsetSnapshot = to > from
        ? from + completedDistance
        : from - completedDistance;

    return offsetSnapshot;
}
