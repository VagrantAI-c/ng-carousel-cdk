import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { startAnimation } from './start-animation';

/**
 * Creates new transition from one slide to another
 */
export function startAnimationProcedure(noop: boolean): Procedure {
    return ({state, procedureState, environment}: ProcedureStateFacade): ProcedureHandler => {
        const animation = startAnimation(
            state.animatableContainer,
            procedureState?.offsetSnapshot ?? null,
            state.offset,
            state.config.widthMode,
            noop ? 0 : state.config.transitionDuration,
            environment?.animationBezierArgs ?? [],
            environment?.isBrowser ?? false,
            environment?.afterAnimationAction ?? (() => {}),
        );
        const modifiedState: CarouselState = {
            ...state,
            animation,
        };

        return new ContinueWith(modifiedState);
    };
}
