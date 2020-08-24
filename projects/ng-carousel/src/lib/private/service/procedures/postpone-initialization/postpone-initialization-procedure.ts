import { InitializationState } from '../../../models/initialization-state';
import { BreakWith } from '../../../models/procedure/handler/break-with.model';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Would break procedure when carousel is not ready
 * for first initialization
 */
export function postponeInitializationProcedure(): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const phase = state?.initializationState ?? new InitializationState();
        if (phase.configInitialized && phase.viewportWidthInitialized) {

            return new ContinueWith(state);
        }

        return new BreakWith(state);
    };
}
