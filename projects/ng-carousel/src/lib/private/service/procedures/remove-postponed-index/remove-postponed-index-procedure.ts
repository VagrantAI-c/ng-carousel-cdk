import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

export function removePostponedIndexProcedure(): Procedure {
    return ({state}: ProcedureStateFacade) => {
        const modifiedState: CarouselState = {
            ...state,
            postponedItemIndex: null,
        };

        return new ContinueWith(modifiedState);
    };
}
