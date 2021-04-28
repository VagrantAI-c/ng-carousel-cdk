import { procedurePipe } from '../../models/procedure/procedure-pipe/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { calculateOffsetProcedure } from '../helpers/calculate-offset/calculate-offset-procedure';
import { destroyAnimationProcedure } from '../helpers/destroy-animation/destroy-animation-procedure';
import { markVisibleAndActiveProcedure } from '../helpers/mark-visible-and-active/mark-visible-and-active-procedure';
import { removeExcessiveProcedure } from '../helpers/remove-excessive/remove-excessive-procedure';
import { shuffleSlidesProcedure } from '../helpers/shuffle-slides/shuffle-slides-procedure';

/**
 * Cleans state from excessive slides and completes
 * corresponding duties after completed transition
 */
export function cleanupProcedure(): Procedure {
    return procedurePipe('cleanup',
        destroyAnimationProcedure(),
        markVisibleAndActiveProcedure(),
        calculateOffsetProcedure(),
        removeExcessiveProcedure(),
        shuffleSlidesProcedure(),
        markVisibleAndActiveProcedure(),
    );
}
