import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { animationOffsetSnapshot } from './animation-offset-snapshot';

/**
 * Assigns offset to state like if animation was paused.
 * If animation is not available, current offset will be assigned.
 */
export function animationOffsetSnapshotProcedure(): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const time = new Date().getTime();
        const currentPosition = time - (state.animation?.startTime ?? time);
        const result = animationOffsetSnapshot(
            currentPosition,
            state.config.transitionDuration,
            state.animation?.from ?? null,
            state.animation?.to ?? null,
            state.offset,
            state.animationBezierFn,
        );
        state.offset = result;

        return new ContinueWith(state);
    };
}
