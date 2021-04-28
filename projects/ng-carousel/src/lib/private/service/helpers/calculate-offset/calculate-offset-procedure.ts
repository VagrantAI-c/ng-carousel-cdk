import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureCarouselState } from '../../../models/procedure/procedure-carousel-state.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { calculateOffset } from './calculate-offset';

/**
 * Given current slide state, assigns carousel offset
 */
export function calculateOffsetProcedure(): Procedure {
    return ({state, procedureState}: ProcedureStateFacade) => {
        const result = calculateOffset(
            state.activeSlideIndex,
            state.config.alignMode,
            state.config.slideWidth,
            getViewportWidth(state),
            state.slides.length,
            state.config.shouldLoop,
        );
        const modifiedProcedureState: Partial<ProcedureCarouselState> = {
            ...procedureState,
            offsetSnapshot: state.offset,
        };
        const modifiedState: CarouselState = {
            ...state,
            offset: result.offset,
        };

        return new ContinueWith(modifiedState, modifiedProcedureState);
    };
}
