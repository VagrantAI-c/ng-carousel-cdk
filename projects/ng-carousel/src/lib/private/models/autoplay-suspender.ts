/** Describes suspenders which can block carousel autoplay */
export const enum AutoplaySuspender {
    /** Whether mouse is inside carousel */
    MOUSE,
    /** Whether keyboard (not touch) focus is inside carousel */
    FOCUS,
    /** Whether drag is outgoing */
    DRAG,
}
