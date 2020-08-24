import { AutoplaySuspender } from '../../../models/autoplay-suspender';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { disableAutoplay } from './disable-autoplay';

/**
 * Turns current autoplay timer off with a specified reason
 */
export function disableAutoplayProcedure(suspender: AutoplaySuspender = null): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        state = Object.assign({}, state);
        const autoplay = disableAutoplay(
            suspender,
            state.autoplay,
        );
        state.autoplay = autoplay;

        return new ContinueWith(state);
    };
}
