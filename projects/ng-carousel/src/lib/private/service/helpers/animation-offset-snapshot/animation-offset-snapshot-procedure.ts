import { CarouselState } from '../../../models/carousel-state';
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
        const offset = animationOffsetSnapshot(
            currentPosition,
            state.config.transitionDuration,
            state.animation?.from ?? null,
            state.animation?.to ?? null,
            state.offset,
            state.animationBezierFn,
        );
        const modifiedState: CarouselState = {
            ...state,
            offset,
        };

        return new ContinueWith(modifiedState);
    };
}
