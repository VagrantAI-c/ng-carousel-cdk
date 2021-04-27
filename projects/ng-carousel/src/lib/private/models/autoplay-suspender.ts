/** Describes suspenders which can block carousel autoplay */
export const enum AutoplaySuspender {
    /** Whether mouse is inside carousel */
    MOUSE = 'mouse',
    /** Whether keyboard (not touch) focus is inside carousel */
    FOCUS = 'focus',
    /** Whether drag is outgoing */
    DRAG = 'drag',
    /** Whether page is currently invisible (tab switched etc.) */
    BLUR = 'blur',
}
