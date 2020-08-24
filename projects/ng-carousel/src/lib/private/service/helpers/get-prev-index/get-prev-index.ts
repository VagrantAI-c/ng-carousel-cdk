/**
 * Returns previous slide index as if user
 * clicked "prev" button
 */
export function getPrevIndex(
    slidesLength: number,
    activeSlideIndex: number,
    shouldLoop: boolean,
): number {
    let newIndex = activeSlideIndex - 1;
    if (newIndex < 0) {
        newIndex = shouldLoop
            ? slidesLength - 1
            : 0;
    }

    return newIndex;
}
