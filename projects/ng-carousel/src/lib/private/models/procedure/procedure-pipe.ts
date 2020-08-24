import { ProcedureError } from '../procedure-error';
import { ComposedProcedure } from './composed-procedure.type';
import { ProcedureHandler } from './handler/procedure-handler.interface';
import { ProcedureResult } from './procedure-result.type';
import { ProcedureStateFacade } from './procedure-state-facade.interface';
import { Procedure } from './procedure.type';

/** Organizes array of procedures into single procedure, flattens inner procedures */
export function procedurePipe(procedureName: string, ...args: (ComposedProcedure | null)[]): ProcedureResult {
    return (state: ProcedureStateFacade, parentProcedureName?: string): ProcedureHandler => {
        let handler: ProcedureHandler;
        let procedureIndex = 0;
        for (const procedure of args) {
            if (typeof procedure !== 'function') {
                continue;
            }
            const procedureState = Object.entries(handler?.procedureState ?? {}).length
                ? handler.procedureState
                : state.procedureState;
            const nextState: ProcedureStateFacade = {
                state: handler?.state ?? state.state,
                procedureState: procedureState || {},
                environment: state.environment,
            }
            const procedureSlot = `${procedureName}[${procedureIndex}]`;
            const procedureChainString = parentProcedureName
                ? `${parentProcedureName}->${procedureSlot}`
                : procedureSlot;
            let localHandler: ProcedureHandler | Procedure;
            while (typeof localHandler === 'function' || !localHandler) {
                try {
                    localHandler = !localHandler
                        ? procedure(nextState, procedureChainString)
                        : (localHandler as Procedure)(nextState, procedureChainString);
                } catch (e) {
                    if (!(e instanceof ProcedureError)) {
                        console.error(`Procedure interrupted at ${procedureChainString}`);
                    }
                    throw new ProcedureError(e);
                }
            }
            handler = localHandler;
            procedureIndex++;
            if (handler.shouldBreakProcedure) {
                break;
            }
        }

        return handler;
    }
}