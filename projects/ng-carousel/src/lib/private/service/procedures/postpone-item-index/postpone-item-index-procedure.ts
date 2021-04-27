import { CarouselState } from '../../../models/carousel-state';
import { BreakWith } from '../../../models/procedure/handler/break-with.model';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Guard for assigning item index when no slides are available.
 * Would break procedure on such occasion.
 */
export function postponeItemIndexProcedure(newItemIndex: number): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const hasSlides = Boolean(state.slides.length);
        const modifiedState: CarouselState = {
            ...state,
            postponedItemIndex: hasSlides
                ? null
                : newItemIndex,
        };

        return hasSlides
            ? new ContinueWith(modifiedState)
            : new BreakWith(modifiedState);
    };
}
