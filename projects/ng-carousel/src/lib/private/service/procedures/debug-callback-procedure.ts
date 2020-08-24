import { ContinueWith } from '../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../models/procedure/procedure.type';

/**
 * Calls provided callback when such procedure fires,
 * for debug purposes only
 */
export function debugCallbackProcedure(callback: (state: ProcedureStateFacade) => void): Procedure {
    return (stateFacade: ProcedureStateFacade): ProcedureHandler => {
        callback(stateFacade);

        return new ContinueWith(stateFacade.state);
    };
}
