import { BreakWith } from '../../handler/break-with.model';
import { ProcedureStateFacade } from '../../procedure-state-facade.interface';
import { Procedure } from '../../procedure.type';

/**
 * Changes nothing, just breaks procedure
 */
export function mockBreakProcedure(): Procedure {
  return (facade: Readonly<ProcedureStateFacade>) => {
    return new BreakWith(facade.state);
  };
}
