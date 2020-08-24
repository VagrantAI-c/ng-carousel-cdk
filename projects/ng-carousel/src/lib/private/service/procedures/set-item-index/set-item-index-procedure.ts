import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Assigns item index to state
 */
export function setItemIndexProcedure(newItemIndex: number): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        state.activeItemIndex = newItemIndex;

        return new ContinueWith(state);
    };
}
