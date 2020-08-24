import { setOffsetSnapshotProcedure } from './set-offset-snapshot-procedure';
import { CarouselState } from '../../../models/carousel-state';

describe('setOffsetSnapshotProcedure test suite', () => {

    it('should assign field', () => {
        const state = new CarouselState();
        state.offset = -20;
        const result = setOffsetSnapshotProcedure()({state, procedureState: {}});
        expect(result.procedureState.offsetSnapshot).toBe(-20, 'incorrect offset snapshot');
    });
});
