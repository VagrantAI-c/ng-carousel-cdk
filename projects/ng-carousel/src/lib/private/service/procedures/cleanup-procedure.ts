import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { calculateActiveSlideProcedure } from '../helpers/calculate-active-slide/calculate-active-slide-procedure';
import { calculateOffsetProcedure } from '../helpers/calculate-offset/calculate-offset-procedure';
import { destroyAnimationProcedure } from '../helpers/destroy-animation/destroy-animation-procedure';
import { markVisibleAndActiveProcedure } from '../helpers/mark-visible-and-active/mark-visible-and-active-procedure';
import { removeExcessiveProcedure } from '../helpers/remove-excessive/remove-excessive-procedure';
import { shuffleSlidesProcedure } from '../helpers/shuffle-slides/shuffle-slides-procedure';

export function cleanupProcedure(): Procedure {
    return procedurePipe('cleanup',
        destroyAnimationProcedure(),
        markVisibleAndActiveProcedure(),
        calculateOffsetProcedure(),
        calculateActiveSlideProcedure(),
        removeExcessiveProcedure(),
        shuffleSlidesProcedure(),
        calculateActiveSlideProcedure(),
    );
}
