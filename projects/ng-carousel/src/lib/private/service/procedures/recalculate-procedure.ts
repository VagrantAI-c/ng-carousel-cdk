import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { calculateOffsetProcedure } from '../helpers/calculate-offset/calculate-offset-procedure';
import { markVisibleAndActiveProcedure } from '../helpers/mark-visible-and-active/mark-visible-and-active-procedure';
import { shuffleSlidesProcedure } from '../helpers/shuffle-slides/shuffle-slides-procedure';

/**
 * Programmaticaly recalculates current state
 */
export function recalculateProcedure(): Procedure {
    return procedurePipe('recalculate',
        calculateOffsetProcedure(),
        markVisibleAndActiveProcedure(),
        shuffleSlidesProcedure(),
    );
}
