import { CarouselState } from '../../carousel-state';
import { ProcedureCarouselState } from '../procedure-carousel-state.interface';
import { ProcedureHandler } from './procedure-handler.interface';

export class ContinueWith implements ProcedureHandler {
    public readonly shouldBreakProcedure = false;

    constructor(
        public state: CarouselState,
        public procedureState: Partial<ProcedureCarouselState> = {},
    ) {
    }
}