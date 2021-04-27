import { CarouselState } from '../../../models/carousel-state';
import { BreakWith } from '../../../models/procedure/handler/break-with.model';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { findSlideIndex } from './find-slide-index';

/**
 * Assigns slide index by given item index, breaks procedure if slide index
 * stays the same
 */
export function findSlideIndexProcedure(itemIndex: number): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const result = findSlideIndex(
            state.slides,
            itemIndex ?? state.activeItemIndex,
            state.activeSlideIndex,
        );
        if (result === state.activeSlideIndex) {

            return new BreakWith(state);
        }
        const modifiedState: CarouselState = {
            ...state,
            activeSlideIndex: result,
            activeItemIndex: itemIndex,
        };

        return new ContinueWith(modifiedState);
    };
}
