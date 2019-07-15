/**
 * Number wrapped in object, because functions
 * returning it should also have an option to return
 * `null` if found index is not found.
 */
export interface IterateSideResult {
    foundIndex: number;
}
