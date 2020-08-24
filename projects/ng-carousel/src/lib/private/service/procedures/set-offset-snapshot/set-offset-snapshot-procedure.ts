import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Save offset to procedure state until later use
 */
export function setOffsetSnapshotProcedure(): Procedure {
    return ({state, procedureState}: ProcedureStateFacade): ProcedureHandler => {
        procedureState.offsetSnapshot = state.offset;

        return new ContinueWith(state, procedureState);
    };
}
