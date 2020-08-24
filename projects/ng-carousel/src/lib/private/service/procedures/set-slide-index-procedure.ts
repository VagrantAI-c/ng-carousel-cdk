import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { animationOffsetSnapshotProcedure } from '../helpers/animation-offset-snapshot/animation-offset-snapshot-procedure';
import { calculateOffsetProcedure } from '../helpers/calculate-offset/calculate-offset-procedure';
import { destroyAnimationProcedure } from '../helpers/destroy-animation/destroy-animation-procedure';
import { markVisibleAndActiveProcedure } from '../helpers/mark-visible-and-active/mark-visible-and-active-procedure';
import { shuffleSlidesProcedure } from '../helpers/shuffle-slides/shuffle-slides-procedure';
import { startAnimationProcedure } from '../helpers/start-animation/start-animation-procedure';
import { setOffsetSnapshotProcedure } from './set-offset-snapshot/set-offset-snapshot-procedure';

export function setSlideIndexProcedure(): Procedure {
    return procedurePipe('setSlideIndex',
        animationOffsetSnapshotProcedure(),
        destroyAnimationProcedure(),
        setOffsetSnapshotProcedure(),
        markVisibleAndActiveProcedure(),
        calculateOffsetProcedure(),
        shuffleSlidesProcedure(),
        startAnimationProcedure(),
    );
}
