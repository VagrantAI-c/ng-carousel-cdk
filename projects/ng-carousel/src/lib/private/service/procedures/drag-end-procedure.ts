import { AutoplaySuspender } from '../../models/autoplay-suspender';
import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { calculateActiveSlideProcedure } from '../helpers/calculate-active-slide/calculate-active-slide-procedure';
import { enableAutoplayProcedure } from '../helpers/enable-autoplay/enable-autoplay-procedure';
import { normalizePassedDistanceProcedure } from './normalize-passed-distance/normalize-passed-distance-procedure';
import { setSlideIndexProcedure } from './set-slide-index-procedure';

export function dragEndProcedure(passedDistance: number): Procedure {
    return procedurePipe('dragEnd',
        enableAutoplayProcedure(AutoplaySuspender.DRAG),
        normalizePassedDistanceProcedure(passedDistance),
        calculateActiveSlideProcedure(),
        setSlideIndexProcedure(),
    );
}