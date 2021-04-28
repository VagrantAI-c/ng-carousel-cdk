import { CarouselConfig } from '../../../carousel-config';
import { procedurePipe } from '../../models/procedure/procedure-pipe/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { initializeProcedure } from './initialize-procedure';
import { setConfigProcedure } from './set-config/set-config-procedure';

/**
 * Assigns config and executes initialization effects
 */
export function initializeConfigProcedure<T>(newConfig: CarouselConfig<T>): Procedure {
    return procedurePipe('initializeConfig',
        setConfigProcedure(newConfig),
        initializeProcedure(),
    );
}
