import { CarouselSlide } from '../../../models/carousel-slide';
import { IdGenerator } from '../../../models/id-generator';
import { CopySlidesResult } from './models/copy-slides-result';
import { ShuffleSlidesResult } from './models/shuffle-slides-result';

/**
 * Justifies existing slides in viewport by either
 * - Move slide from one side to another
 * - Copy slide from one side to another
 * - Create slide on one side
 *
 * Task of this function is to leave no empty spaces in viewport.
 *
 * **BE ADVICED**, that inViewport flag should be calculated for each slide
 * that should not be moved beforehand.
 */
export function shuffleSlides<T>(
    slides: CarouselSlide<T>[],
    offset: number,
    slideWidth: number,
    viewportWidth: number,
    items: any[],
    shouldLoop: boolean,
    threshold: number = 0,
    idGenerator = new IdGenerator(),
): ShuffleSlidesResult {
    if (!slides || !slides.length) {

        return new ShuffleSlidesResult([], offset);
    }
    if (slideWidth <= 0 || !shouldLoop) {

        return new ShuffleSlidesResult(slides, offset);
    }

    const slideSumWidth = slides.length * slideWidth;

    // Calculate missing slides for left and right sides
    const leftSideMissingSlides = Math.max(0, Math.ceil((offset + threshold) / slideWidth));
    const rightSideMissingSlides = Math.max(0, Math.ceil((viewportWidth + threshold - (offset + slideSumWidth)) / slideWidth));

    // Let's start to fill missing slides

    /**
     * Item indexes that should be marked as copies after
     * function completes
     */
    let unmarkedItemIndexes: number[] = [];

    // Should move slides to right side
    if (rightSideMissingSlides) {
        const rightSideMoveResult = moveOrCopySlidesToEnd(
            slides,
            offset,
            rightSideMissingSlides,
            slideWidth,
            items,
            idGenerator,
        );
        slides = rightSideMoveResult.slides;
        offset = rightSideMoveResult.modifiedOffset;
        unmarkedItemIndexes = rightSideMoveResult.unmarkedItemIndexes;
    }

    // Should move slides to left side
    if (leftSideMissingSlides) {
        const leftSideMoveResult = moveOrCopySlidesToStart(
            slides,
            offset,
            leftSideMissingSlides,
            slideWidth,
            items,
            idGenerator,
        );
        slides = leftSideMoveResult.slides;
        offset = leftSideMoveResult.modifiedOffset;
        unmarkedItemIndexes = unmarkedItemIndexes.concat(leftSideMoveResult.unmarkedItemIndexes);
    }

    const result = new ShuffleSlidesResult(slides, offset);

    return result;
}

/**
 * Moves, copies or creates slides to the right side in order to fill
 * desired `quantity`.
 *
 * Quantity means of how much new slides will be added.
 * There are two options of how we could fill missing slides.
 * Imagine next slides row mapped to their item index:
 * [3, 4, 5, 0, 1, 2, 3, 4, 5] and lets take `quantity` = 4.
 * We can't just start to move/copy slides from the right part,
 * because we can't break sequence (meaning if we'll copy slide `5`
 * on the right to slide `3` on the left, they won't stack).
 * Slide `3` on the left awaits slide with item index `2` to be put
 * near him, so we should create some slides in between. This action
 * is named `Option FILL GAP`.
 *
 * `Option FILL GAP`:
 * How much slides are in between item index `5` and item index `3`?
 * Answer is 3: [**5**, 0, 1, 2, **3**]. So let's fill those 3 slides
 * and subtract their length from `quantity`.
 * Now we have row [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5] and `quantity`
 * equals 1. Now we can start copy/move slides from the right part.
 * This action is called `Option COPY`
 *
 * `Option COPY`:
 * When meddling with slides from the other side, we have two options
 * of what to do with them: either copy or move. Slide can be moved
 * when it is not `inViewport`, meaning it has corresponding option
 * flag. Otherwise it should be copied.
 * In our example we should move one slide from the right part, since
 * `quantity` after `Option FILL` equals 1. Lets imagine that slide
 * wasn't in viewport and now our slide row has
 * [5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4], voila!
 */
export function moveOrCopySlidesToEnd<T>(
    slides: CarouselSlide<T>[],
    offset: number,
    quantity: number,
    slideWidth: number,
    items: any[],
    idGenerator = new IdGenerator(),
): CopySlidesResult<T> {
    if (quantity < 1) {

        return new CopySlidesResult(slides, offset, []);
    }

    const newSlides = [];
    /** Item indexes that should be marked as copies later */
    const unmarkedItemIndexes = [];
    /** Used as argument for splice call later */
    let spliceQuantity = 0;
    /**
     * We can't increase quantity if we encountered slide
     * with inViewport flag
     */
    let canIncreaseQuantity = true;
    /**
     * Iterator index, used in COPY option. Determines which
     * slide should be picked from left side for analyzing.
     */
    let slideIndex = 0;
    /**
     * Once we finished with option FILL GAP, then
     * copy option should take place
     */
    let shouldCopy = false;

    // We going to iterate through item indexes starting from
    // last slide item index. Let's pick an item index
    // to start from.
    const lastSlide = slides[slides.length - 1];
    const lastSlideHasLastItemIndex = lastSlide.itemIndex >= items.length - 1;
    /**
     * Iterator index, used in FILL GAP and COPY options.
     * This index determines which item will next slide have.
     */
    let nextItemId = lastSlideHasLastItemIndex
        ? 0
        : lastSlide.itemIndex + 1;

    for (let i = 0; i < quantity; i++) {
        /**
         * Having this field as true means slides from left and right
         * side (including new slides) can stack and we can proceed to
         * COPY option
         */
        const firstSlideHasNextItemId = slides[0].itemIndex === nextItemId;

        if (shouldCopy || firstSlideHasNextItemId) {
            // Option COPY

            shouldCopy = true;
            const currentSlide = slides[slideIndex];

            // Create new slide procedure
            const newOptions = Object.assign({}, currentSlide.options);
            // There should be an already existing isActive slide,
            // so we turning isActive off for copy
            newOptions.isActive = false;
            // Every filled item is considered to be in viewport,
            // because why else would we call this function
            // otherwise? To fill viewport obviously.
            newOptions.inViewport = true;
            const newSlide = new CarouselSlide(
                idGenerator.next(),
                nextItemId,
                newOptions
            );
            newSlides.push(newSlide);

            // Splice arguments processing

            if (currentSlide?.options?.inViewport) {
                canIncreaseQuantity = false;
            }

            // We can't increase quantity if we have reached end of slides.
            // It happens when quantity from argument is higher than
            // slides size.
            const canIncrementSpliceQuantity = spliceQuantity + 1 <= slides.length;
            if (canIncreaseQuantity && canIncrementSpliceQuantity) {
                spliceQuantity++;
            }

            // Prepare slide to process
            slideIndex++;
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
        } else {
            // Option FILL GAP

            // Create new slide procedure
            const newSlide = new CarouselSlide(
                idGenerator.next(),
                nextItemId,
                {
                    // Every filled item is considered to be in viewport,
                    // because why else would we call this function
                    // otherwise? To fill viewport obviously.
                    inViewport: true,
                    item: items[nextItemId],
                    // There should be an already existing isActive slide,
                    // so we turning isActive off for copy
                    isActive: false,
                },
            );
            newSlides.push(newSlide);
            unmarkedItemIndexes.push(nextItemId);
        }

        // Pick index for next item
        nextItemId++;
        if (nextItemId >= items.length) {
            nextItemId = 0;
        }
    }

    if (spliceQuantity > 0) {
        slides.splice(0, spliceQuantity);
    }
    const resultSlides = [
        ...slides,
        ...newSlides
    ];
    const resultOffset = offset + spliceQuantity * slideWidth;

    return new CopySlidesResult(resultSlides, resultOffset, unmarkedItemIndexes);
}

/**
 * Moves, copies or creates slides to the left side in order to fill
 * desired `quantity`.
 *
 * Quantity means of how much new slides will be added.
 * There are two options of how we could fill missing slides.
 * Imagine next slides row mapped to their item index:
 * [0, 1, 2, 3, 4, 5, 0, 1, 2, 3] and lets take `quantity` = 4.
 * We can't just start to move/copy slides from the left part,
 * because we can't break sequence (meaning if we'll copy slide `0`
 * on the right to slide `3` on the right, they won't stack).
 * Slide `3` on the right side awaits slide with item index `2` to be
 * put near him, so we should create some slides in between. This
 * action is named `Option FILL GAP`.
 *
 * `Option FILL GAP`:
 * How much slides are in between item index `0` and item index `3`?
 * Answer is 2: [**3**, 4, 5, **0**]. So let's fill these 2 slides
 * and subtract their length from `quantity`.
 * Now we have row [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5] and `quantity`
 * equals 2. Now we can start copy/move slides from the left part.
 * This action is called `Option COPY`
 *
 * `Option COPY`:
 * When meddling with slides from the other side, we have two options
 * of what to do with them: either copy or move. Slide can be moved
 * when it is not `inViewport`, meaning it has corresponding option
 * flag. Otherwise it should be copied.
 * In our example we should move two slides from the left part, since
 * `quantity` after `Option FILL` equals 2. Lets imagine that slides
 * weren't in viewport and now our row has
 * [2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1], voila!
 */
export function moveOrCopySlidesToStart<T>(
    slides: CarouselSlide<T>[],
    offset: number,
    quantity: number,
    slideWidth: number,
    items: any[],
    idGenerator = new IdGenerator(),
): CopySlidesResult<T> {
    if (quantity < 1) {

        return new CopySlidesResult(slides, offset, []);
    }

    const newSlides = [];
    /** Item indexes that should be marked as copies later */
    const unmarkedItemIndexes = [];
    /** Used as argument for splice call later */
    let spliceFrom = null;
    /** Used as argument for splice call later */
    let spliceQuantity = 0;
    /**
     * Once we finished with option FILL GAP, then
     * copy option should take place
     */
    let shouldCopy = false;

    /**
     * Iterator index, used in COPY option. Determines which
     * slide should be picked from right side for analyzing.
     */
    let slideIndex = slides.length - 1;

    // We going to iterate through item indexes starting from
    // first slide item index. Let's pick an item index
    // to start from.
    const firstSlide = slides[0];
    const firstSlideHasFirstItemId = firstSlide.itemIndex === 0;
    /**
     * Iterator index, used in FILL GAP and COPY options.
     * This index determines which item will next slide have.
     */
    let nextItemId = firstSlideHasFirstItemId
        ? items.length - 1
        : firstSlide.itemIndex - 1;

    for (let i = 0; i < quantity; i++) {
        const lastSlideHasNextItemId = slides[slides.length - 1].itemIndex === nextItemId;

        if (shouldCopy || lastSlideHasNextItemId) {
            // Option COPY

            shouldCopy = true;
            const currentSlide = slides[slideIndex];

            // Slide copy procedure
            const newOptions = Object.assign({}, currentSlide.options);
            // There should be an already existing isActive slide,
            // so we turning isActive off for copy
            newOptions.isActive = false;
            // Every filled item is considered to be in viewport,
            // because why else would we call this function
            // otherwise? To fill viewport obviously.
            newOptions.inViewport = true;
            const newSlide = new CarouselSlide(
                idGenerator.next(),
                nextItemId,
                newOptions,
            );
            newSlides.push(newSlide);

            // Prepare next slide index
            slideIndex--;
            if (slideIndex < 0) {
                slideIndex = slides.length - 1;
            }

            // Splice arguments processing

            // spliceFrom can be assigned once and equals first inViewport
            // slide that we met
            if (spliceFrom === null && currentSlide?.options?.inViewport) {
                spliceFrom = slides.length - spliceQuantity;
            }

            // We can't increase quantity if we have determined
            // from where we should splice slides
            const slideCopyNotEncountered = spliceFrom === null;
            // We can't have splice quantity higher than slides size.
            // It happens when quantity from argument is higher than
            // slides size.
            const canIncrementSpliceQuantity = spliceQuantity + 1 <= slides.length;
            if (slideCopyNotEncountered && canIncrementSpliceQuantity) {
                spliceQuantity++;
            }
        } else {
            // Option FILL GAP

            // Slide copy procedure
            const newSlide = new CarouselSlide(
                idGenerator.next(),
                nextItemId,
                {
                    // Every filled item is considered to be in viewport,
                    // because why else would we call this function
                    // otherwise? To fill viewport obviously.
                    inViewport: true,
                    item: items[nextItemId],
                    // There should be an already existing isActive slide,
                    // so we turning isActive off for copy
                    isActive: false,
                },
            );
            newSlides.push(newSlide);
            unmarkedItemIndexes.push(nextItemId);
        }

        // Pick index for next item
        nextItemId--;
        if (nextItemId < 0) {
            nextItemId = items.length - 1;
        }
    }

    if (spliceQuantity > 0) {
        spliceFrom = spliceFrom === null
            ? slides.length - spliceQuantity
            : spliceFrom;
        slides.splice(spliceFrom, spliceQuantity);
    }
    const result = [
        ...newSlides.reverse(),
        ...slides,
    ];

    return new CopySlidesResult(result, offset - newSlides.length * slideWidth, unmarkedItemIndexes);
}
