import { CarouselState } from '../carousel-state';
import { ProcedureCarouselState } from './procedure-carousel-state.interface';
import { ProcedureEnvironment } from './procedure-environment.interface';

/** Defines data that is passed into each called procedure */
export interface ProcedureStateFacade {
    state: CarouselState;
    procedureState?: Partial<ProcedureCarouselState>;
    environment?: ProcedureEnvironment;
}
