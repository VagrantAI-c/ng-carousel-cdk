import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { calculateActiveSlide } from './calculate-active-slide';

/**
 * Given current slide state, assigns active slide
 */
export function calculateActiveSlideProcedure(): Procedure {
    return ({state, procedureState, environment}: ProcedureStateFacade): ProcedureHandler => {
        const result = calculateActiveSlide(
            state.slides,
            state.offset,
            state.config.alignMode,
            state.config.slideWidth,
            getViewportWidth(state),
            Math.min(state.config.slideWidth / 2, environment?.swipeThreshold ?? Infinity),
            procedureState.passedDistance || null,
        );
        const modifiedState: CarouselState = {
            ...state,
            activeSlideIndex: result.slideIndex,
            activeItemIndex: state.slides[result.slideIndex]?.itemIndex ?? 0,
        };

        return new ContinueWith(modifiedState);
    };
}
