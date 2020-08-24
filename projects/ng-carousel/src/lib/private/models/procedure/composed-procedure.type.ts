import { ProcedureHandler } from './handler/procedure-handler.interface';
import { ProcedureStateFacade } from './procedure-state-facade.interface';
import { Procedure } from './procedure.type';

/**
 * A higher order procedure: a procedure which might return another procedure
 */
export type ComposedProcedure = (state: ProcedureStateFacade, parentProcedureName?: string) => ProcedureHandler | Procedure;
