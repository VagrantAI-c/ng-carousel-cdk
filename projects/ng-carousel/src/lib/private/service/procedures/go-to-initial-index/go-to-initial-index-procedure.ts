import { ComposedProcedure } from '../../../models/procedure/composed-procedure.type';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { procedurePipe } from '../../../models/procedure/procedure-pipe/procedure-pipe';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { goToProcedure } from '../go-to-procedure';
import { removePostponedIndexProcedure } from '../remove-postponed-index/remove-postponed-index-procedure';

/**
 * Navigates carousel to specified index (whether provided by user
 * or saved from earlier navigations)
 */
export function goToInitialIndexProcedure(): ComposedProcedure {
    return ({state, procedureState}: ProcedureStateFacade): ProcedureHandler | Procedure => {
        if (!state.slides.length) {

            return new ContinueWith(state);
        }
        const maxIndex = state.config.items.length - 1;
        const restoredIndex = state.config.initialIndex({
            maxIndex,
            currentItemIndex: procedureState.activeItemIndex ?? 0,
        });
        if (restoredIndex !== 0) {
            const safeIndex = Math.max(Math.min(restoredIndex, maxIndex), 0);
            return procedurePipe('setPostponedIndex',
                goToProcedure(safeIndex, true),
                removePostponedIndexProcedure(),
            );
        }
        if (state.postponedItemIndex) {
            const itemIndex = state.postponedItemIndex;

            return procedurePipe('setPostponedIndex',
                goToProcedure(itemIndex, true),
                removePostponedIndexProcedure(),
            );
        }

        return new ContinueWith(state);
    };
}
