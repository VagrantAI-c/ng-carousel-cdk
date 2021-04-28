import { CarouselSlide } from '../../../models/carousel-slide';
import { CarouselState } from '../../../models/carousel-state';
import { IdGenerator } from '../../../models/id-generator';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureCarouselState } from '../../../models/procedure/procedure-carousel-state.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { shuffleSlides } from './shuffle-slides';

/**
 * Moves slide from left side to right or vise versa
 * in order to balance weight or predict offset changes
 */
export function shuffleSlidesProcedure(): Procedure {
    return ({state, procedureState, environment}: ProcedureStateFacade): ProcedureHandler => {
        const result = shuffleSlides(
            state.slides,
            state.offset,
            state.config.slideWidth,
            getViewportWidth(state),
            state.config.items,
            state.config.shouldLoop,
            state.config.threshold,
            environment?.slideIdGenerator ?? new IdGenerator(),
        );
        const modifiedState: CarouselState = {
            ...state,
            slides: result.slides,
            activeSlideIndex: result.slides.findIndex((item: CarouselSlide) => item.options.isActive) || 0,
            offset: result.modifiedOffset,
        };
        // Might be necessary for animations
        const modifiedProcedureState: Partial<ProcedureCarouselState> = {
            ...procedureState,
            offsetSnapshot: result.modifiedOffset - state.offset + (procedureState?.offsetSnapshot ?? 0),
        };

        return new ContinueWith(modifiedState, modifiedProcedureState);
    };
}
