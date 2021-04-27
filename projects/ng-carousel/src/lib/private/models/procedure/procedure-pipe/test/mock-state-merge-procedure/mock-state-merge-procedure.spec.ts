import { CarouselState } from '../../../../carousel-state';
import { MOCK_CAROUSEL_STATE } from '../../../../test/mock-carousel-state.const';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../../../test/mock-procedure-environment.const';
import { ProcedureCarouselState } from '../../../procedure-carousel-state.interface';
import { mockStateMergeProcedure } from './mock-state-merge-procedure';

describe('mockStateMergeProcedure test suite', () => {

  it('should merge props', () => {
    const partialState: Partial<CarouselState> = {
      activeItemIndex: 100500,
      offset: 200000,
    };
    const partialProcedureState: Partial<ProcedureCarouselState> = {
      inViewportRange: [500, 1000],
    };
    const procedure = mockStateMergeProcedure(partialState, partialProcedureState);
    const result = procedure({state: MOCK_CAROUSEL_STATE, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
    expect(result.shouldBreakProcedure).toBeFalse();
    expect(result.state).toEqual({
      ...MOCK_CAROUSEL_STATE,
      ...partialState,
    });
    expect(result.procedureState).toEqual(partialProcedureState);
  });

});
