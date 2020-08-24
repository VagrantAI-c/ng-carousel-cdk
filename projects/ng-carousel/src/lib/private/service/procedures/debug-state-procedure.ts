import { Procedure } from '../../models/procedure/procedure.type';
import { ProcedureStateFacade } from '../../models/procedure/procedure-state-facade.interface';
import { ProcedureHandler } from '../../models/procedure/handler/procedure-handler.interface';
import { ContinueWith } from '../../models/procedure/handler/contiue-with.model';

/** Logs current state */
export function debugStateProcedure(prefixString: string = ''): Procedure {
    return (stateFacade: ProcedureStateFacade): ProcedureHandler => {
        const clonedStateFacade: ProcedureStateFacade = {
            state: {...stateFacade.state},
            procedureState: {...stateFacade.procedureState},
            environment: {...stateFacade.environment},
        };
        console.log(prefixString, clonedStateFacade);

        return new ContinueWith(stateFacade.state);
    }
}