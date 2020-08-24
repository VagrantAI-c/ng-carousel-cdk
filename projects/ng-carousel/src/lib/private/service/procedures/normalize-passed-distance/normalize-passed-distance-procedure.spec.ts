import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { CarouselState } from '../../../models/carousel-state';
import { ProcedureCarouselState } from '../../../models/procedure/procedure-carousel-state.interface';
import { normalizePassedDistanceProcedure } from './normalize-passed-distance-procedure';

describe('normalizePassedDistanceProcedure test suite', () => {

    it('should convert when for percent units', () => {
        const procedure = normalizePassedDistanceProcedure(32);
        const state: CarouselState = new CarouselState();
        state.widthContainer = {offsetWidth: 320};
        state.config.widthMode = CarouselWidthMode.PERCENT;
        const procedureState: Partial<ProcedureCarouselState> = {};
        const result = procedure({state, procedureState});
        expect(result.shouldBreakProcedure).toBeFalsy('procedure is interrupted');
        expect(result.procedureState.passedDistance).toBe(10, 'incorrect passed distance');
    });

    it('should not convert for px units', () => {
        const procedure = normalizePassedDistanceProcedure(32);
        const state: CarouselState = new CarouselState();
        state.config.widthMode = CarouselWidthMode.PX;
        const procedureState: Partial<ProcedureCarouselState> = {};
        const result = procedure({state, procedureState});
        expect(result.shouldBreakProcedure).toBeFalsy('procedure is interrupted');
        expect(result.procedureState.passedDistance).toBe(32, 'incorrect passed distance');
    });

});
