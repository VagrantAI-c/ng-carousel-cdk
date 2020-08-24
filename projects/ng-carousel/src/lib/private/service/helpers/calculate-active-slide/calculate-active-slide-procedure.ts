import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { calculateActiveSlide } from './calculate-active-slide';

export function calculateActiveSlideProcedure(): Procedure {
    return ({state, procedureState, environment}: ProcedureStateFacade): ProcedureHandler => {
        const result = calculateActiveSlide(
            state.slides,
            state.offset,
            state.config.alignMode,
            state.config.slideWidth,
            getViewportWidth(state),
            Math.min(state.config.slideWidth / 2, environment.swipeThreshold),
            procedureState.passedDistance || null,
        );
        state.activeSlideIndex = result.slideIndex;
        state.activeItemIndex = state.slides[result.slideIndex].itemIndex;

        return new ContinueWith(state);
    }
}