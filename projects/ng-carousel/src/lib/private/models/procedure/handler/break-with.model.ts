import { ProcedureHandler } from './procedure-handler.interface';
import { CarouselState } from '../../carousel-state';
import { ProcedureCarouselState } from '../procedure-carousel-state.interface';

export class BreakWith implements ProcedureHandler {
    public readonly shouldBreakProcedure = true;

    constructor(
        public state: CarouselState,
        public procedureState: ProcedureCarouselState = null,
    ) {
    }
}