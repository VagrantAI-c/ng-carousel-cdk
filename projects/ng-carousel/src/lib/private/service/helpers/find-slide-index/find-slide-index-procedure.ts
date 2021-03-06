import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { findSlideIndex } from './find-slide-index';

/**
 * Assigns slide index by given item index
 */
export function findSlideIndexProcedure(itemIndex: number): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const result = findSlideIndex(
            state.slides,
            itemIndex ?? state.activeItemIndex,
            state.activeSlideIndex,
        );
        state.activeSlideIndex = result;
        state.activeItemIndex = itemIndex;

        return new ContinueWith(state);
    };
}
