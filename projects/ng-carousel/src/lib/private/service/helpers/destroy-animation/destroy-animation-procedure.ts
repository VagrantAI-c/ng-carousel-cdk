import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { destroyAnimation } from './destroy-animation';

/**
 * Destroys and removes any ongoing animation state
 */
export function destroyAnimationProcedure(): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        destroyAnimation(state.animation);
        state.animation = null;

        return new ContinueWith(state);
    }
}