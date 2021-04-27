/**
 * Slide options that might be changing over time
 */
export interface CarouselSlideParams<T = any> {
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
    /**
     * Whether active slide is placed to the right
     * of the current one. Returns false if the slide
     * is active
     */
    activeOnTheRight: boolean;
    /**
     * Whether active slide is placed to the left
     * of the current one. Returns false if the slide
     * is active
     */
    activeOnTheLeft: boolean;
    /** Item to be put in slide template context */
    item: T;
}
