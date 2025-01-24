import { procedurePipe } from '../../models/procedure/procedure-pipe/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { enableAutoplayProcedure } from '../helpers/enable-autoplay/enable-autoplay-procedure';
import { findSlideIndexProcedure } from '../helpers/find-slide-index/find-slide-index-procedure';
import { postponeItemIndexProcedure } from './postpone-item-index/postpone-item-index-procedure';
import { setSlideIndexProcedure } from './set-slide-index-procedure';

/** Assigns item index and shuffles slides accordingly */
export function goToProcedure(newItemIndex: number, immediate: boolean): Procedure {
    return procedurePipe('goTo',
        postponeItemIndexProcedure(newItemIndex),
        enableAutoplayProcedure(),
        findSlideIndexProcedure(newItemIndex),
        setSlideIndexProcedure(immediate),
    );
}
