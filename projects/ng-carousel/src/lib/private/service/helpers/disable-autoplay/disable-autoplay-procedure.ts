import { AutoplaySuspender } from '../../../models/autoplay-suspender';
import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { disableAutoplay } from './disable-autoplay';

/**
 * Turns current autoplay timer off with a specified reason
 */
export function disableAutoplayProcedure(suspender: AutoplaySuspender): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const autoplay = disableAutoplay(
            suspender,
            state.autoplay,
        );
        const modifiedState: CarouselState = {
            ...state,
            autoplay,
        };

        return new ContinueWith(modifiedState);
    };
}
