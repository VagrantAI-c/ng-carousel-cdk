/**
 * Represents how carousel calculates slide width. Be advised
 * that actual enum value is used in code, so change with caution.
 */
export enum CarouselWidthMode {
    /**
     * When pixel management is provided, carousel calculates
     * slide width with pixels. Preferred to use in limited space
     * where carousel width is more or less is predefined.
     */
    PX = 'px',
    /**
     * When percent management is provided, carousel calculates
     * slide width with relative instrument (via percents). Preferred
     * to use in full-width carousel, where carousel width is unknown.
     */
    PERCENT = '%',
}
