/**
 * Returns next slide index as if user
 * clicked "next" button
 */
export function getNextIndex(
    slidesLength: number,
    activeSlideIndex: number,
    shouldLoop: boolean,
): number {
    let newIndex = activeSlideIndex + 1;
    if (newIndex >= slidesLength) {
        newIndex = shouldLoop
            ? 0
            : slidesLength - 1;
    }

    return newIndex;
}