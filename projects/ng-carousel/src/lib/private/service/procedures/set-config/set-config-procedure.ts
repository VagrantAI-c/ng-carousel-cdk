import { CompleteCarouselConfig } from '../../../models/carousel-config';
import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Assigns carousel config, works as part of multiphase carousel initialization
 */
export function setConfigProcedure<T>(config: CompleteCarouselConfig<T>): Procedure {
    return ({state}: ProcedureStateFacade<T>): ProcedureHandler => {
        const modifiedState: CarouselState = {
            ...state,
            config,
            initializationState: {
                ...state.initializationState,
                configInitialized: true,
            },
        };

        return new ContinueWith(modifiedState);
    };
}
