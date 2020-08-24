import bezier from 'bezier-easing';

import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

// Reference: https://easings.net/ru
// Standard ease
export const ANIMATION_BEZIER_ARGS = [0.25, 0.1, 0.25, 1];
// Ease out quad
const DRAG_BEZIER_ARGS = [0.25, 0.46, 0.45, 0.94];

/**
 * Creates bezier functions for different purposes
 */
export function setBeziersProcedure(): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        if (!state.dragBezierFn) {
            state.dragBezierFn = bezier(
                DRAG_BEZIER_ARGS[0],
                DRAG_BEZIER_ARGS[1],
                DRAG_BEZIER_ARGS[2],
                DRAG_BEZIER_ARGS[3],
            );
        }
        if (!state.invertedDragBezierFn) {
            state.invertedDragBezierFn = bezier(
                1 - DRAG_BEZIER_ARGS[0],
                1 - DRAG_BEZIER_ARGS[1],
                1 - DRAG_BEZIER_ARGS[2],
                1 - DRAG_BEZIER_ARGS[3],
            );
        }
        if (!state.animationBezierFn) {
            state.animationBezierFn = bezier(
                ANIMATION_BEZIER_ARGS[0],
                ANIMATION_BEZIER_ARGS[1],
                ANIMATION_BEZIER_ARGS[2],
                ANIMATION_BEZIER_ARGS[3],
            );
        }

        return new ContinueWith(state);
    };
}
