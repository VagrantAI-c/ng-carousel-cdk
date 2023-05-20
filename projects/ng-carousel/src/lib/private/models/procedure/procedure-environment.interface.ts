import { NgZone } from '@angular/core';
import { IdGenerator } from '../id-generator';

/**
 * Defines environment data which is static
 * for every procedure call
 */
export interface ProcedureEnvironment {
    slideIdGenerator: IdGenerator;
    autoplayAction: () => void;
    afterAnimationAction: () => void;
    isBrowser: boolean;
    animationBezierArgs: number[];
    swipeThreshold: number;
    maxOverscroll: number;
    zone: NgZone;
}
