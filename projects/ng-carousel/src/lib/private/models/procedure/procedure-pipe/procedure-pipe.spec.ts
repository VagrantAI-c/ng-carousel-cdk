import { MOCK_CAROUSEL_STATE } from '../../test/mock-carousel-state.const';
import { MOCK_PROCEDURE_ENVIRONMENT } from '../../test/mock-procedure-environment.const';
import { procedurePipe } from './procedure-pipe';
import { mockAsIsProcedure } from './test/mock-as-is-procedure';
import { mockBreakProcedure } from './test/mock-break-procedure';
import { mockStateMergeProcedure } from './test/mock-state-merge-procedure/mock-state-merge-procedure';

describe('procedurePipe test suite', () => {

  it('should return unchanged facade', () => {
    const procedure = procedurePipe('mock', mockAsIsProcedure());
    const result = procedure({
      state: MOCK_CAROUSEL_STATE,
      procedureState: {
        inViewportRange: [25, 30],
      },
      environment: MOCK_PROCEDURE_ENVIRONMENT,
    });
    expect(result.state).toBe(MOCK_CAROUSEL_STATE);
    expect(result.procedureState).toEqual({inViewportRange: [25, 30]});
    expect(result.shouldBreakProcedure).toBeFalse();
  });

  it('should merge facade', () => {
    const procedure = procedurePipe('mock',
      mockStateMergeProcedure({offset: 20}, {}),
      mockStateMergeProcedure({}, {passedDistance: 2000}),
      mockStateMergeProcedure({offset: 1000, isDragged: true}, {passedDistance: 10}),
      mockStateMergeProcedure({}, {}),
    );
    const result = procedure({state: MOCK_CAROUSEL_STATE, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
    expect(result.state.offset).toBe(1000);
    expect(result.state.isDragged).toBeTrue();
    expect(result.procedureState).toEqual({passedDistance: 10});
    expect(result.shouldBreakProcedure).toBeFalse();
  });

  it('should interrupt procedure', () => {
    const procedure = procedurePipe('mock',
      mockStateMergeProcedure({offset: 20}, {}),
      mockStateMergeProcedure({}, {passedDistance: 2000}),
      mockBreakProcedure(),
      mockStateMergeProcedure({offset: 5000, postponedItemIndex: 20}, {passedDistance: 10}),
    );
    const result = procedure({state: MOCK_CAROUSEL_STATE, environment: MOCK_PROCEDURE_ENVIRONMENT, procedureState: {}});
    expect(result.state.offset).toBe(20);
    expect(result.state.postponedItemIndex).toBe(MOCK_CAROUSEL_STATE.postponedItemIndex);
    expect(result.procedureState).toEqual({passedDistance: 2000});
    expect(result.shouldBreakProcedure).toBeTrue();
  });

});
