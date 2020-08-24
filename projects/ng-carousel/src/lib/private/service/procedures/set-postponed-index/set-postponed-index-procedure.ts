import { ComposedProcedure } from '../../../models/procedure/composed-procedure.type';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { procedurePipe } from '../../../models/procedure/procedure-pipe';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { goToProcedure } from '../go-to-procedure';
import { removePostponedIndexProcedure } from '../remove-postponed-index/remove-postponed-index-procedure';

export function setPostponedIndexProcedure(): ComposedProcedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler | Procedure => {
        if (state.slides.length && state.postponedItemIndex) {
            const itemIndex = state.postponedItemIndex;

            return procedurePipe('setPostponedIndex',
                goToProcedure(itemIndex),
                removePostponedIndexProcedure(),
            );
        }

        return new ContinueWith(state);
    }
}
