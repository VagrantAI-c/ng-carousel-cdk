import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { findSlideIndex } from './find-slide-index';

export function findSlideIndexProcedure(newIndex?: number): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const result = findSlideIndex(
            state.slides,
            typeof newIndex === 'undefined' ? state.activeItemIndex : newIndex,
            state.activeSlideIndex,
        );
        state.activeSlideIndex = result;
        state.activeItemIndex = newIndex;

        return new ContinueWith(state);
    }
}