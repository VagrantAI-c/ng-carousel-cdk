import { BreakWith } from '../../../models/procedure/handler/break-with.model';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Would break procedure whether drag is disabled
 */
export function postponeDragEnabledProcedure(): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        if (state?.config?.dragEnabled) {

            return new ContinueWith(state);
        }

        return new BreakWith(state);
    };
}
