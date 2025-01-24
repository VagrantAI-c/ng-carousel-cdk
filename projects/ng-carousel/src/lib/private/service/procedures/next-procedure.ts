import { procedurePipe } from '../../models/procedure/procedure-pipe/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { enableAutoplayProcedure } from '../helpers/enable-autoplay/enable-autoplay-procedure';
import { getNextIndexProcedure } from '../helpers/get-next-index/get-next-index-procedure';
import { setSlideIndexProcedure } from './set-slide-index-procedure';

/**
 * Increments current slide
 */
export function nextProcedure(omitAutoplayReset = false): Procedure {
    return procedurePipe('next',
        omitAutoplayReset ? null : enableAutoplayProcedure(),
        getNextIndexProcedure(),
        setSlideIndexProcedure(false),
    );
}
