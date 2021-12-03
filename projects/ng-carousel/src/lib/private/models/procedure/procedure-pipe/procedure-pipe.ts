import { ProcedureError } from '../../procedure-error';
import { ComposedProcedure } from '../composed-procedure.type';
import { ProcedureHandler } from '../handler/procedure-handler.interface';
import { ProcedureCarouselState } from '../procedure-carousel-state.interface';
import { ProcedureResult } from '../procedure-result.type';
import { ProcedureStateFacade } from '../procedure-state-facade.interface';
import { Procedure } from '../procedure.type';

/** Organizes array of procedures into single procedure, flattens inner procedures */
export function procedurePipe(procedureName: string, ...args: (ComposedProcedure | null)[]): ProcedureResult {
    return (parentState: ProcedureStateFacade, parentProcedureName?: string): ProcedureHandler => {
        let state = parentState.state;
        let procedureState: Partial<ProcedureCarouselState> = parentState.procedureState;
        let procedureIndex = 0;
        let shouldBreakProcedure = false;

        for (const procedure of args) {
            if (typeof procedure !== 'function') {
                continue;
            }
            const nextState: ProcedureStateFacade = {
                state,
                procedureState,
                environment: parentState.environment,
            };
            const procedureSlot = `${procedureName}[${procedureIndex}]`;
            const procedureChainString = parentProcedureName
                ? `${parentProcedureName}->${procedureSlot}`
                : procedureSlot;
            let localHandler: ProcedureHandler | Procedure | null = null;
            while (typeof localHandler === 'function' || !localHandler) {
                // Recursively call procedure until all the inner functions
                // are unwrapped into object value
                try {
                    localHandler = !localHandler
                        ? procedure(nextState, procedureChainString)
                        : localHandler(nextState, procedureChainString);
                } catch (e: unknown) {
                    if (!(e instanceof ProcedureError)) {
                        console.error(`Procedure interrupted at ${procedureChainString}`);
                    }
                    throw new ProcedureError(e as Error);
                }
            }
            state = localHandler.state;
            procedureState = {
                ...procedureState,
                ...(localHandler.procedureState || {}),
            };
            shouldBreakProcedure = localHandler.shouldBreakProcedure;
            procedureIndex++;
            if (shouldBreakProcedure) {
                break;
            }
        }

        return {
            state,
            procedureState,
            shouldBreakProcedure,
        };
    };
}

function generateState(
    handler: ProcedureHandler | null,
    parentProcedureState: ProcedureStateFacade,
): ProcedureStateFacade {
    const procedureState = handler && Object.entries(handler?.procedureState ?? {}).length
        ? handler.procedureState
        : parentProcedureState.procedureState;
    const nextState: ProcedureStateFacade = {
        state: {...(handler?.state ?? parentProcedureState.state)},
        procedureState: {...(procedureState || {})},
        environment: {...parentProcedureState.environment},
    };

    return nextState;
}
