import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { removeExcessive } from './remove-excessive';

/**
 * Removes slide copies
 */
export function removeExcessiveProcedure(): Procedure {
    return ({state, procedureState}: ProcedureStateFacade): ProcedureHandler => {
        const result = removeExcessive(
            state.slides,
            state.offset,
            state.config.slideWidth,
            state.activeSlideIndex,
            procedureState?.inViewportRange?.[0] ?? null,
            procedureState?.inViewportRange?.[1] ?? null,
        );
        const modifiedState: CarouselState = {
            ...state,
            slides: result.slides,
            offset: result.offset,
            activeSlideIndex: result.activeSlideIndex,
            activeItemIndex: result.activeItemIndex,
            slideIndex: state.slideIndex + (result.slidesChanged ? 1 : 0),
        };

        return new ContinueWith(modifiedState);
    };
}
