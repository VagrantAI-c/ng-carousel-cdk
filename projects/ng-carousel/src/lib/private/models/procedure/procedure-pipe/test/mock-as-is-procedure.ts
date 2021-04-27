import { ContinueWith } from '../../handler/contiue-with.model';
import { ProcedureStateFacade } from '../../procedure-state-facade.interface';
import { Procedure } from '../../procedure.type';

/**
 * Returns state without changes
 */
export function mockAsIsProcedure(): Procedure {
  return (facade: Readonly<ProcedureStateFacade>) => {
    return new ContinueWith(facade.state);
  };
}
