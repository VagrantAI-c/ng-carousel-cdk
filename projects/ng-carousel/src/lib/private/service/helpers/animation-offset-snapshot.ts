import { EasingFunction } from 'bezier-easing';

/**
 * Calculates offset for animation specific tick
 */
export function animationOffsetSnapshot(
    currentDuration: number,
    totalDuration: number,
    from: number,
    to: number,
    bezierFn: EasingFunction,
): number {
    if (totalDuration <= 0 || currentDuration < 0 || to === from) {

        return to;
    }
    const animationDistance = Math.abs(to - from);
    const completedDistancePercent = currentDuration / totalDuration;
    const completedDistance = animationDistance * bezierFn(completedDistancePercent);
    const offsetSnapshot = to > from
        ? from + completedDistance
        : from - completedDistance;

    return offsetSnapshot;
}
