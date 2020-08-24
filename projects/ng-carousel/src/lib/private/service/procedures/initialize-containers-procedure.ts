import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { initializeProcedure } from './initialize-procedure';
import { setContainersProcedure } from './set-containers/set-containers-procedure';

export function initializeContainersProcedure(widthContainer: HTMLElement, animatableContainer: HTMLElement): Procedure {
    return procedurePipe('initializeContainers',
        setContainersProcedure(widthContainer, animatableContainer),
        initializeProcedure(),
    );
}
