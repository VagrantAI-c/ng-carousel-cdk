import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidthInPx } from '../../helpers/get-viewport-width-in-px/get-viewport-width-in-px';

/** Converts passed distance to carousel width units */
export function normalizePassedDistanceProcedure(passedDistance: number): Procedure {
    return ({state, procedureState}: ProcedureStateFacade): ProcedureHandler => {
        procedureState.passedDistance = state.config.widthMode === CarouselWidthMode.PERCENT
            ? 100 * passedDistance / getViewportWidthInPx(state)
            : passedDistance;

        return new ContinueWith(state, procedureState);
    };
}
