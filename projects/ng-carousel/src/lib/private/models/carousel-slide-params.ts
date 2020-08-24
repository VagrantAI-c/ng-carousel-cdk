/**
 * Slide options that might be changing over time
 */
export interface CarouselSlideParams {
    /**
     * Whether slide in viewport. Should be truthy
     * whether slide was in viewport before
     * the animation or would be in there afterwards.
     * Slides in viewport should not be meddled by
     * shuffling.
     */
    inViewport: boolean;
    /** Whether provided slide is selected */
    isActive: boolean;
    /** Item to be put in slide template context */
    item: any;
}
