import { Procedure } from '../../models/procedure/procedure.type';
import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { postponeInitializationProcedure } from './postpone-initialization/postpone-initialization-procedure';
import { setPostponedIndexProcedure } from './set-postponed-index/set-postponed-index-procedure';
import { setFirstInitializationProcedure } from './set-first-initalization/set-first-initialization-procedure';
import { calculateOffsetProcedure } from '../helpers/calculate-offset/calculate-offset-procedure';
import { markVisibleAndActiveProcedure } from '../helpers/mark-visible-and-active/mark-visible-and-active-procedure';
import { shuffleSlidesProcedure } from '../helpers/shuffle-slides/shuffle-slides-procedure';
import { destroyAnimationProcedure } from '../helpers/destroy-animation/destroy-animation-procedure';
import { enableAutoplayProcedure } from '../helpers/enable-autoplay/enable-autoplay-procedure';
import { calculateActiveSlideProcedure } from '../helpers/calculate-active-slide/calculate-active-slide-procedure';
import { setBeziersProcedure } from './set-beziers/set-beziers-procedure';
import { initializeCarouselProcedure } from '../helpers/initialize-carousel/initialize-carousel-procedure';

/**
 * Creates slides from scratch
 */
export function initializeProcedure(): Procedure {
    return procedurePipe('initialize',
        postponeInitializationProcedure(),

        setFirstInitializationProcedure(),
        initializeCarouselProcedure(),
        calculateOffsetProcedure(),
        markVisibleAndActiveProcedure(),
        shuffleSlidesProcedure(),
        destroyAnimationProcedure(),
        enableAutoplayProcedure(),
        calculateActiveSlideProcedure(),
        setBeziersProcedure(),

        setPostponedIndexProcedure(),
    );
}
