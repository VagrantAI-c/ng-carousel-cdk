/**
 * Carousel state that stores temporal values
 * that exists only inside single procedure
 */
export interface ProcedureCarouselState {
    /**
     * Represents tuple for range of slide indexes that are within viewport,
     * expanded to active slide (in case it is outside viewport)
     */
    inViewportRange: [number, number];
    /**
     * Saved offset for later use, might be used for deducing animation
     * from and to offsets
     */
    offsetSnapshot: number;
    /** Represents distance passed during single drag session */
    passedDistance: number;
    /** Item index that was active before procedure */
    activeItemIndex: number;
}
