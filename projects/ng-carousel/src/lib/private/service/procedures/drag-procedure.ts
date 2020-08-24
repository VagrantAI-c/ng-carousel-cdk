import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { animationOffsetSnapshotProcedure } from '../helpers/animation-offset-snapshot/animation-offset-snapshot-procedure';
import { calculateActiveSlideProcedure } from '../helpers/calculate-active-slide/calculate-active-slide-procedure';
import { destroyAnimationProcedure } from '../helpers/destroy-animation/destroy-animation-procedure';
import { dragOffsetSnapshotProcedure } from '../helpers/drag-offset/drag-offset-snapshot-procedure';
import { markVisibleAndActiveProcedure } from '../helpers/mark-visible-and-active/mark-visible-and-active-procedure';
import { shuffleSlidesProcedure } from '../helpers/shuffle-slides/shuffle-slides-procedure';
import { postponeDragEnabledProcedure } from './postpone-drag-enabled/postpone-drag-enabled-procedure';
import { debugCallbackProcedure } from './debug-callback-procedure';

export function dragProcedure(fromX: number, toX: number): Procedure {
    return procedurePipe('drag',
        postponeDragEnabledProcedure(),
        animationOffsetSnapshotProcedure(),
        destroyAnimationProcedure(),
        dragOffsetSnapshotProcedure(fromX, toX),
        markVisibleAndActiveProcedure(),
        shuffleSlidesProcedure(),
        calculateActiveSlideProcedure(),
        markVisibleAndActiveProcedure(),
    );
}