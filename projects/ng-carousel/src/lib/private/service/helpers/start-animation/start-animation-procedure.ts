import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { startAnimation } from './start-animation';

/**
 * Creates new transition from one slide to another
 */
export function startAnimationProcedure(): Procedure {
    return ({state, procedureState, environment}: ProcedureStateFacade): ProcedureHandler => {
        const animation = startAnimation(
            state.animatableContainer,
            procedureState.offsetSnapshot,
            state.offset,
            state.config.widthMode,
            state.config.transitionDuration,
            environment?.animationBezierArgs ?? [],
            environment?.isBrowser ?? false,
            environment?.afterAnimationAction ?? (() => {}),
            environment?.animationBuilder,
        );
        state.animation = animation;

        return new ContinueWith(state);
    }
}
