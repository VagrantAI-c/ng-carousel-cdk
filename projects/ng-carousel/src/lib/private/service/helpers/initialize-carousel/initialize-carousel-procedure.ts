import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { initializeCarousel } from './initialize-carousel';

export function initializeCarouselProcedure(): Procedure {
    return ({state, environment}: ProcedureStateFacade): ProcedureHandler => {
        const result = initializeCarousel(
            state.config.items,
            environment.slideIdGenerator,
        );
        state.slides = result;
        state.offset = 0;
        state.activeSlideIndex = 0;

        return new ContinueWith(state);
    }
}
