import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureCarouselState } from '../../../models/procedure/procedure-carousel-state.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { markVisibleAndActive } from './mark-visible-and-active';

/**
 * Assigns inViewport and isActive option to each slide
 */
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
        const modifiedState: CarouselState = {
            ...state,
            slides: result.slides,
            activeItemIndex: result.slides[state.activeSlideIndex]?.itemIndex ?? 0, // 0 when no slides available
        };
        const modifiedProcedureState: Partial<ProcedureCarouselState> = {
            ...procedureState,
            inViewportRange: [result.inViewportRangeStart, result.inViewportRangeEnd],
        };

        return new ContinueWith(modifiedState, modifiedProcedureState);
    };
}
