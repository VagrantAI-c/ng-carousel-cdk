import { CarouselState } from '../../carousel-state';
import { ProcedureCarouselState } from '../procedure-carousel-state.interface';
import { ProcedureHandler } from './procedure-handler.interface';

export class BreakWith implements ProcedureHandler {
    public readonly shouldBreakProcedure = true;

    constructor(
        public state: CarouselState,
        public procedureState: ProcedureCarouselState | null = null,
    ) {
    }
}
