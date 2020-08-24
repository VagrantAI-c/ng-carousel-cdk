import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getNextIndex } from './get-next-index';

export function getNextIndexProcedure(): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const result = getNextIndex(
            state.slides.length,
            state.activeSlideIndex,
            state.config.shouldLoop,
        );
        state.activeSlideIndex = result;

        return new ContinueWith(state);
    }
}
