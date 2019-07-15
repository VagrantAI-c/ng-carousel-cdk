/**
 * Result for helper function `calculateSideWeight`
 */
export class SideWeightChart {

    constructor(
        /** Slides which are completely visible */
        public visibles?: number,
        /**
         * Whether there is a slide that is partially visible.
         * Since there could be only one semivisible slide, this
         * field is declared as boolean.
         */
        public hasSemivisible?: boolean,
        /** Slides which are completely out of viewport */
        public offsiders?: number,
        /** Possible amount of slides that can be filled as visibles */
        public missingSlides?: number,
    ) {
    }

}
