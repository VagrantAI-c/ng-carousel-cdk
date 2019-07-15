import { initializeCarousel } from './initialize-carousel';
import { IdGenerator } from '../../models/id-generator';

describe('initializeCarousel test suite', () => {

    it('should create slides', () => {
        const items = [4, 67, 'asd', {a: 'd'}, [1, 2, 3]];
        const slides = initializeCarousel(items, new IdGenerator());
        for (let i = 0; i < items.length; i++) {
            expect(slides[i].id).toBe(i, `inconsistent ${i} slide id`);
            expect(slides[i].itemIndex).toBe(i, `inconsistent ${i} slide index`);
            expect(slides[i].options).toEqual({
                item: items[i],
                isActive: i === 0,
            });
            expect(slides[i].options.inViewport).toBeUndefined();
            expect(slides[i].options.isCopy).toBeUndefined();
        }
    });

    it('should not create when items are empty', () => {
        expect(initializeCarousel([], new IdGenerator())).toEqual([]);
        expect(initializeCarousel(null, new IdGenerator())).toEqual([]);
    });

    it('should not create when id generator is not defined', () => {
        expect(initializeCarousel([1, 2, 3], null)).toEqual([]);
    });

});
