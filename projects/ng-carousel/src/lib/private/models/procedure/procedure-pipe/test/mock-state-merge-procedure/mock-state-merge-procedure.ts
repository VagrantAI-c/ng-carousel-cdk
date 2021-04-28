import { CarouselState } from '../../../../carousel-state';
import { ContinueWith } from '../../../handler/contiue-with.model';
import { ProcedureCarouselState } from '../../../procedure-carousel-state.interface';
import { ProcedureStateFacade } from '../../../procedure-state-facade.interface';
import { Procedure } from '../../../procedure.type';

/**
 * Merges provided state as if this procedure
 * did some actual work with state
 */
export function mockStateMergeProcedure(
  partialState: Partial<CarouselState>,
  partialProcedureState: Partial<ProcedureCarouselState>,
): Procedure {
  return ({state, procedureState}: Readonly<ProcedureStateFacade>) => {
    const mergedState: CarouselState = {
      ...state,
      ...partialState,
    };
    const mergedProcedureState: Partial<ProcedureCarouselState> = {
      ...procedureState,
      ...partialProcedureState,
    };

    return new ContinueWith(mergedState, mergedProcedureState);
  };
}
