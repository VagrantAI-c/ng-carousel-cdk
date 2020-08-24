import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Set state as initialized
 */
export function setFirstInitializationProcedure(): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        state.initializationState.firstInitalization = true;

        return new ContinueWith(state);
    };
}
