import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { enableAutoplayProcedure } from '../helpers/enable-autoplay/enable-autoplay-procedure';
import { getPrevIndexProcedure } from '../helpers/get-prev-index/get-prev-index-procedure';
import { setSlideIndexProcedure } from './set-slide-index-procedure';

export function prevProcedure(): Procedure {
    return procedurePipe('prev',
        enableAutoplayProcedure(),
        getPrevIndexProcedure(),
        setSlideIndexProcedure(),
    );
}
