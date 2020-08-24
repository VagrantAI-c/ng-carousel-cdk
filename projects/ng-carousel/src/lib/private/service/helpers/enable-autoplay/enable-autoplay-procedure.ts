import { AutoplaySuspender } from '../../../models/autoplay-suspender';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { enableAutoplay } from './enable-autoplay';

/**
 * Enables autoplay when such option is available in config
 */
export function enableAutoplayProcedure(suspender: AutoplaySuspender = null): Procedure {
    return ({state, environment}: ProcedureStateFacade): ProcedureHandler => {
        state = Object.assign({}, state);
        const autoplay = enableAutoplay(
            state.config.autoplayEnabled,
            state.config.transitionDuration,
            state.config.autoplayDelay,
            environment?.isBrowser ?? false,
            environment?.autoplayAction ?? (() => {}),
            suspender,
            state.autoplay,
        );
        state.autoplay = autoplay;

        return new ContinueWith(state);
    }
}