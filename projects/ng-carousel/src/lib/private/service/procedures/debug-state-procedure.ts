import { ContinueWith } from '../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../models/procedure/procedure.type';

/**
 * Logs current state when such procedure fires,
 * for debug purposes only
 */
export function debugStateProcedure(prefixString: string = ''): Procedure {
    return (stateFacade: ProcedureStateFacade): ProcedureHandler => {
        const clonedStateFacade: ProcedureStateFacade = {
            state: {...stateFacade.state},
            procedureState: {...stateFacade.procedureState},
            environment: {...stateFacade.environment},
        };
        console.log(prefixString, clonedStateFacade);

        return new ContinueWith(stateFacade.state);
    };
}
