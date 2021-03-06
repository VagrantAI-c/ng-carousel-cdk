import { CarouselState } from '../../../models/carousel-state';
import { setOffsetSnapshotProcedure } from './set-offset-snapshot-procedure';

describe('setOffsetSnapshotProcedure test suite', () => {

    it('should assign field', () => {
        const state = new CarouselState();
        state.offset = -20;
        const result = setOffsetSnapshotProcedure()({state, environment: {}, procedureState: {}});
        expect(result?.procedureState?.offsetSnapshot).toBe(-20, 'incorrect offset snapshot');
    });
});
