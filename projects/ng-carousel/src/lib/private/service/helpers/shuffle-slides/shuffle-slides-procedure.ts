import { IdGenerator } from '../../../models/id-generator';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { shuffleSlides } from './shuffle-slides';
import { CarouselSlide } from '../../../models/carousel-slide';

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
        state.slides = result.slides;
        state.activeSlideIndex = result.slides.findIndex((item: CarouselSlide) => item.options.isActive) || 0;
        if (typeof procedureState.offsetSnapshot !== 'undefined') {
            procedureState.offsetSnapshot = result.modifiedOffset - state.offset + procedureState.offsetSnapshot;
        }
        state.offset = result.modifiedOffset;

        return new ContinueWith(state);
    }
}
