import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { initializeCarousel } from './initialize-carousel';

/**
 * Creates new slide set from scratch
 */
export function initializeCarouselProcedure(): Procedure {
    return ({state, environment}: ProcedureStateFacade): ProcedureHandler => {
        const result = initializeCarousel(
            state.config.items,
            environment.slideIdGenerator ?? null,
        );
        const modifiedState: CarouselState = {
            ...state,
            slides: result,
            offset: 0,
            activeSlideIndex: 0,
            slideIndex: state.slideIndex + 1,
        };

        return new ContinueWith(modifiedState);
    };
}
