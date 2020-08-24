import { AutoplaySuspender } from '../../models/autoplay-suspender';
import { procedurePipe } from '../../models/procedure/procedure-pipe';
import { Procedure } from '../../models/procedure/procedure.type';
import { disableAutoplayProcedure } from '../helpers/disable-autoplay/disable-autoplay-procedure';
import { postponeDragEnabledProcedure } from './postpone-drag-enabled/postpone-drag-enabled-procedure';

export function dragStartProcedure(): Procedure {
    return procedurePipe('dragStart',
        postponeDragEnabledProcedure(),
        disableAutoplayProcedure(AutoplaySuspender.DRAG),
    );
}
