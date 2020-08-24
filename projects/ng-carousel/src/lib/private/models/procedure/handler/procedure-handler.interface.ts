import { CarouselState } from '../../carousel-state';
import { ProcedureCarouselState } from '../procedure-carousel-state.interface';

export interface ProcedureHandler {
    state: CarouselState;
    procedureState: Partial<ProcedureCarouselState>;
    shouldBreakProcedure: boolean;
}
