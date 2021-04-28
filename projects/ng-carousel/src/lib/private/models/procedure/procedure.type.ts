import { ProcedureHandler } from './handler/procedure-handler.interface';
import { ProcedureStateFacade } from './procedure-state-facade.interface';

export type Procedure = (state: Readonly<ProcedureStateFacade>, parentProcedureName?: string) => ProcedureHandler;
