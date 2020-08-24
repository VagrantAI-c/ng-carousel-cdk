import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { markVisibleAndActive } from './mark-visible-and-active';

export function markVisibleAndActiveProcedure(): Procedure {
    return ({state, procedureState}: ProcedureStateFacade) => {
        const result = markVisibleAndActive(
            state.slides,
            state.offset,
            state.config.slideWidth,
            getViewportWidth(state),
            state.activeSlideIndex,
            state.config.threshold,
            state.config.alignMode,
        );
        state.slides = result.slides;
        state.activeItemIndex = result.slides[state.activeSlideIndex].itemIndex;
        procedureState.inViewportRange = [result.inViewportRangeStart, result.inViewportRangeEnd];

        return new ContinueWith(state, procedureState);
    }
}
