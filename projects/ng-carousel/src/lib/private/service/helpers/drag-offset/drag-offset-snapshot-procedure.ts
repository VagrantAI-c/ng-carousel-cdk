import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { getViewportWidthInPx } from '../get-viewport-width-in-px/get-viewport-width-in-px';
import { getViewportWidth } from '../get-viewport-width/get-viewport-width';
import { dragOffsetSnapshot } from './drag-offset-snapshot';

export function dragOffsetSnapshotProcedure(fromX: number, toX: number): Procedure {
    return ({state, environment}: ProcedureStateFacade): ProcedureHandler => {
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            state.offset,
            state.config.widthMode,
            state.config.alignMode,
            state.config.shouldLoop,
            getViewportWidth(state),
            getViewportWidthInPx(state),
            state.config.slideWidth,
            state.slides.length * state.config.slideWidth,
            environment.maxOverscroll,
            state.dragBezierFn,
            state.invertedDragBezierFn,
        );
        state.offset = result;

        return new ContinueWith(state);
    }
}

