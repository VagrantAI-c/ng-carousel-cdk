
import { EasingFunction } from 'bezier-easing';

import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { CarouselWidthMode } from '../../../../carousel-width-mode';

/**
 * Return new offset modified by last drag operations.
 * Applies overscroll behavior when necessary.
 *
 * @returns modified offset
 */
export function dragOffsetSnapshot(
    /** X position in pixels from where drag event began */
    fromX: number,
    /** destination X in pixels of last fired drag event */
    toX: number,
    currentOffset: number,
    widthMode: CarouselWidthMode,
    alignMode: CarouselAlignMode,
    shouldLoop: boolean,
    viewportWidth: number,
    viewportWidthInPx: number,
    slideWidth: number,
    slideSumWidth: number,
    /** How much in percents user can overscroll unlooped carousel */
    maxOverscrollPercent: number | null,
    bezierFn: EasingFunction | null,
    invertedBezierFn: EasingFunction | null,
): number {
    if (fromX === toX) {

        return currentOffset;
    }
    if (maxOverscrollPercent === null) {

        return currentOffset;
    }
    if (!bezierFn || !invertedBezierFn) {

        return currentOffset;
    }

    // Normalize all pixel values to current width mode
    if (widthMode === CarouselWidthMode.PERCENT) {
        fromX = fromX * 100 / viewportWidthInPx;
        toX = toX * 100 / viewportWidthInPx;
    }

    let offsetDelta = toX - fromX;

    // 1st case: no bezier amendments, just return offset with applied delta
    if (shouldLoop) {

        return currentOffset + offsetDelta;
    }

    const overscrollStartPoint = detectOverscrollStartPoint(
        fromX,
        currentOffset,
        viewportWidth,
        slideWidth,
        slideSumWidth,
        alignMode,
        maxOverscrollPercent,
        invertedBezierFn,
    );

    // 2nd case where bezier correction haven't started yet,
    // meaning we're in safe zone at both side
    if (overscrollStartPoint === null) {
        const offsetFromSafeZone = applyDeltaFromSafeZone(
            currentOffset,
            offsetDelta,
            alignMode,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
        );

        return offsetFromSafeZone;
    }

    // Seems like we already at overscroll zone, so let's see
    // the ways we could manage that

    /** Whether drag was performed from overscroll zone to same overscroll zone */
    const dragStaysInSameOverscrollZone = fromX > overscrollStartPoint
        ? toX > overscrollStartPoint
        : toX < overscrollStartPoint;

    // 3rd case: we should not amend when drag pointer is still in overscroll zone
    // after applying delta
    if (dragStaysInSameOverscrollZone) {
        const distanceBefore = fromX - overscrollStartPoint;
        const distanceAfter = toX - overscrollStartPoint;
        const distance = distanceBetween(
            distanceBefore,
            distanceAfter,
            viewportWidth,
            maxOverscrollPercent,
            bezierFn,
        );
        currentOffset = currentOffset - distance;

        return currentOffset;
    }

    // 4th case where drag pointer has returned to safe zone.
    // We should do the same calculation like we did in 2nd case.
    const overscrollDistance = applyDeltaFromOverscrollZone(
        overscrollStartPoint - fromX,
        viewportWidth,
        maxOverscrollPercent,
        bezierFn,
    );
    const distancetoSafeZone = overscrollStartPoint - fromX;
    currentOffset += overscrollDistance;
    fromX = overscrollStartPoint;
    offsetDelta -= distancetoSafeZone;

    const result = applyDeltaFromSafeZone(
        currentOffset,
        offsetDelta,
        alignMode,
        viewportWidth,
        slideWidth,
        slideSumWidth,
        maxOverscrollPercent,
        bezierFn,
    );

    return result;
}

/**
 * Applies bezier on distance and limit with max overscroll distance
 *
 * BE ADVISED, that all argument values should be converted to current width mode
 * beforehand.
 */
function applyDeltaFromOverscrollZone(
    distance: number,
    viewportWidth: number,
    maxOverscrollPercent: number,
    bezierFn: BezierEasing.EasingFunction,
): number {
    /** Viewport % from 0 to 1 of delta distance */
    const deltaPercentage = Math.max(0, Math.min(Math.abs(distance) / viewportWidth, 1));
    /** Maximal distance of overscroll in pixels */
    const maxOverscrollDistance = viewportWidth * maxOverscrollPercent / 100;
    /**
     * How much delta is actually long when applying bezier
     * and aligning overscroll max distance
     */
    const deltaDistance = maxOverscrollDistance * bezierFn(deltaPercentage) * Math.sign(distance);

    return deltaDistance;
}

/**
 * Applies delta to current offset which is currently in safe zone at this moment.
 * Applies bezier whether delta intersects overscroll zone.
 *
 * BE ADVISED, that all argument values should be converted to current width mode
 * beforehand.
 */
function applyDeltaFromSafeZone(
    currentOffset: number,
    offsetDelta: number,
    alignMode: CarouselAlignMode,
    viewportWidth: number,
    slideWidth: number,
    slideSumWidth: number,
    maxOverscrollPercent: number,
    bezierFn: BezierEasing.EasingFunction,
): number {
    const leftmostPoint = alignMode === CarouselAlignMode.CENTER
        ? viewportWidth / 2 - slideWidth / 2
        : 0;
    const rightmostPoint = alignMode === CarouselAlignMode.CENTER
        ? viewportWidth / 2 + slideWidth / 2
        : Math.min(viewportWidth, slideSumWidth);
    /** Whether left side of carousel is in viewport after applying delta */
    const leftSideExposedAfter = currentOffset + offsetDelta > leftmostPoint;
    /** Whether right side of carousel is in viewport after applying delta */
    const rightSideExposedAfter = currentOffset + slideSumWidth + offsetDelta < rightmostPoint;

    const canSafelyTransit = (!leftSideExposedAfter && offsetDelta > 0)
        || (!rightSideExposedAfter && offsetDelta < 0);

    if (canSafelyTransit) {
        // We're still safe on both sides, just apply delta

        return currentOffset + offsetDelta;
    }

    /**
     * Distance between current offset and point
     * where overscroll begins
     */
    let distanceToSafeZone = 0;
    // Move offset to the point where overscroll begins
    if (leftSideExposedAfter) {
        distanceToSafeZone = currentOffset - leftmostPoint;
    } else if (rightSideExposedAfter) {
        distanceToSafeZone = currentOffset + slideSumWidth - rightmostPoint;
    }

    /**
     * Distance between current offset and
     * overscroll zone starting point
     */
    const distanceWithoutSafeZone = offsetDelta + distanceToSafeZone;
    currentOffset -= distanceToSafeZone;

    const overscrollDelta = applyDeltaFromOverscrollZone(
        distanceWithoutSafeZone,
        viewportWidth,
        maxOverscrollPercent,
        bezierFn,
    );
    currentOffset += overscrollDelta;

    return currentOffset;
}

/**
 * Returns point where overscroll should potentially start
 * or null if carousel is currently in safe zone.
 */
function detectOverscrollStartPoint(
    fromX: number,
    currentOffset: number,
    viewportWidth: number,
    slideWidth: number,
    slideSumWidth: number,
    alignMode: CarouselAlignMode,
    maxOverscrollPercent: number,
    invertedBezierFn: BezierEasing.EasingFunction,
): number | null {
    const leftmostPoint = alignMode === CarouselAlignMode.CENTER
        ? viewportWidth / 2 - slideWidth / 2
        : 0;
    const rightmostPoint = alignMode === CarouselAlignMode.CENTER
        ? viewportWidth / 2 + slideWidth / 2
        : Math.min(leftmostPoint + slideSumWidth, viewportWidth);

    /** Distance from current offset to safe zone */
    let overscrollConvertedDistance: number | null = null;
    // Special case when left-aligned carousel is lesser than viewport width
    if (alignMode === CarouselAlignMode.LEFT && slideSumWidth < viewportWidth && currentOffset !== 0) {
        overscrollConvertedDistance = currentOffset;
    } else if (currentOffset > leftmostPoint) {
        overscrollConvertedDistance = currentOffset - leftmostPoint;
    } else if (currentOffset < rightmostPoint - slideSumWidth) {
        overscrollConvertedDistance = currentOffset - rightmostPoint + slideSumWidth;
    }
    if (overscrollConvertedDistance === null) {

        return null;
    }
    const overscrollRealDistance = extractDeltaFromOverscrollZone(
        overscrollConvertedDistance,
        viewportWidth,
        maxOverscrollPercent,
        invertedBezierFn,
    );
    const overscrollStartPoint = fromX - overscrollRealDistance;

    return overscrollStartPoint;
}

/**
 * Converts distance with bezier applied to distance
 * without bezier
 */
function extractDeltaFromOverscrollZone(
    convertedDistance: number,
    viewportWidth: number,
    maxOverscrollPercent: number,
    invertedBezierFn: BezierEasing.EasingFunction,
): number {
    const maxOverscrollDistance = viewportWidth * maxOverscrollPercent / 100;
    const bezierValue = Math.abs(convertedDistance / maxOverscrollDistance);
    const deltaPercentage = invertedBezierFn(bezierValue) * viewportWidth * Math.sign(convertedDistance);

    return deltaPercentage;
}

/**
 * Calculates overscroll distance between two points
 */
function distanceBetween(
    firstPoint: number,
    secondPoint: number,
    viewportWidth: number,
    maxOverscrollPercent: number,
    bezierFn: BezierEasing.EasingFunction,
): number {
    const overscrollBefore = applyDeltaFromOverscrollZone(
        firstPoint,
        viewportWidth,
        maxOverscrollPercent,
        bezierFn,
    );
    const overscrollAfter = applyDeltaFromOverscrollZone(
        secondPoint,
        viewportWidth,
        maxOverscrollPercent,
        bezierFn,
    );
    const distance = overscrollBefore - overscrollAfter;

    return distance;
}
