import { CarouselState } from '../../../models/carousel-state';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Saves DOM element containers for carousel as part of initialization phase
 */
export function setContainersProcedure(widthContainer: HTMLElement, animatableContainer: HTMLElement): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const modifiedState: CarouselState = {
            ...state,
            widthContainer,
            animatableContainer,
            initializationState: {
                ...state.initializationState,
                viewportWidthInitialized: true,
            },
        };

        return new ContinueWith(modifiedState);
    };
}
