/**
 * Since we don't want excessive slide recalculation
 * while main inputs are still on their way, we should
 * collect them and then initialize carousel when
 * everything is ready.
 */
export class InitializationState {
    configInitialized = false;
    viewportWidthInitialized = false;
    /** Whether slides were created for the first time */
    firstInitalization = false;
}
