import { CarouselSlide } from '../../models/carousel-slide';
import { moveOrCopySlidesToEnd, moveOrCopySlidesToStart, shuffleSlides } from './shuffle-slides';

describe('weight calculation test suite', () => {

    describe('shuffleSlides test suite', () => {

        let slides3: CarouselSlide[];
        let items3: any[];
        let slides6: CarouselSlide[];
        let items6: any[];

        beforeEach(() => {
            slides3 = [
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 1),
                new CarouselSlide(2, 2),
            ];
            items3 = [1, 2, 3];
            slides6 = [
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 1),
                new CarouselSlide(2, 2),
                new CarouselSlide(3, 3),
                new CarouselSlide(4, 4),
                new CarouselSlide(5, 5),
            ];
            items6 = [1, 2, 3, 4, 5, 6];
        });

        it('must shuffle common pattern', () => {
            const modifiedOffset = 0;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides3,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
        });

        it('must shuffle with offset', () => {
            const modifiedOffset = 5;
            const slideWidth = 90;
            const viewportWidth = 100;
            slides3[0].options.inViewport = true;
            slides3[1].options.inViewport = true;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides3,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(2, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(1, 'incorrect 2 item index');
            expect(result.slides[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.modifiedOffset).toBe(-85, 'incorrect offset');
        });

        it('must move slides from right side', () => {
            const modifiedOffset = 30;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides3,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(2, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(1, 'incorrect 2 item index');
            expect(result.slides[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
        });

        it('must move minimal amount of slides from right side', () => {
            const modifiedOffset = 30;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides6,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items6,
                shouldLoop,
            );
            expect(result.slides.length).toBe(6, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(5, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(1, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(2, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(3, 'incorrect 4 item index');
            expect(result.slides[5].itemIndex).toBe(4, 'incorrect 5 item index');
            expect(result.slides[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
        });

        it('must copy from right side if there are no donors', () => {
            const modifiedOffset = 19;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0, {inViewport: true}),
                    new CarouselSlide(1, 1, {inViewport: true}),
                    new CarouselSlide(2, 2, {inViewport: true}),
                ],
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(4, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(2, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(1, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(2, 'incorrect 3 item index');
            expect(result.slides[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.slides[1].options.inViewport).toBeTruthy('incorrect 1 inViewport');
            expect(result.slides[2].options.inViewport).toBeTruthy('incorrect 2 inViewport');
            expect(result.slides[3].options.inViewport).toBeTruthy('incorrect 3 inViewport');
            expect(result.modifiedOffset).toBe(-21, 'incorrect offset');
        });

        it('must not move from right side even with available donors but no free space to move to', () => {
            const modifiedOffset = 0;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides6,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items6,
                shouldLoop,
            );
            expect(result.slides.length).toBe(6, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(3, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(4, 'incorrect 4 item index');
            expect(result.slides[5].itemIndex).toBe(5, 'incorrect 5 item index');
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
        });

        it('must move slides from left side', () => {
            const modifiedOffset = -50;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides3,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(2, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(0, 'incorrect 2 item index');
            expect(result.slides[2].options.inViewport).toBeTruthy('incorrect 2 inViewport');
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
        });

        it('must move minimal amount of slides from left side', () => {
            const modifiedOffset = -170;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides6,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items6,
                shouldLoop,
            );
            expect(result.slides.length).toBe(6, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(2, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(3, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(4, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(5, 'incorrect 4 item index');
            expect(result.slides[5].itemIndex).toBe(0, 'incorrect 5 item index');
            expect(result.slides[5].options.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.modifiedOffset).toBe(-130, 'incorrect offset');
        });

        it('must not move whether no free slots are present', () => {
            const modifiedOffset = -5;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides3,
                modifiedOffset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.modifiedOffset).toBe(-5, 'incorrect offset');
        });

        it('must shuffle two full-width slides with drag intent', () => {
            // User started a drag and moved slide 1px left
            const modifiedOffset = -11;
            const slideWidth = 10;
            const viewportWidth = 10;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0),
                    new CarouselSlide(1, 1, {inViewport: true}),
                ],
                modifiedOffset,
                slideWidth,
                viewportWidth,
                [1, 2],
                shouldLoop,
            );
            expect(result.slides.length).toBe(2, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[0].options.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.slides[1].options.inViewport).toBeTruthy('incorrect 1 inViewport');
            expect(result.modifiedOffset).toBe(-1, 'incorrect offset');
        });

        it('must copy slides to both sides', () => {
            const modifiedOffset = 40;
            const slideWidth = 20;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0, {inViewport: true}),
                ],
                modifiedOffset,
                slideWidth,
                viewportWidth,
                [1],
                shouldLoop,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            for (let i = 0; i < result.slides.length; i++) {
                expect(result.slides[i].itemIndex).toBe(0, `incorrect ${i} item index`);
                expect(result.slides[i].options.isCopy).toBeTruthy(`incorrect ${i} isCopy`);
                expect(result.slides[i].options.inViewport).toBeTruthy(`incorrect ${i} inViewport`);
            }
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
        });

        it('must not shuffle for zero slide width', () => {
            const offset = 0;
            const slideWidth = 0;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides3,
                offset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
        });

        it('must have only one active slide', () => {
            const offset = 45;
            const slideWidth = 10;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0, {isActive: true, inViewport: true}),
                    new CarouselSlide(1, 1, {inViewport: true}),
                    new CarouselSlide(2, 2, {inViewport: true}),
                ],
                offset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(11, 'incorrect length');
            for (let i = 0; i < result.slides.length; i++) {
                i === 5
                    ? expect(result.slides[i].options.isActive).toBeTruthy('incorrect active slide index')
                    : expect(result.slides[i].options.isActive).toBeFalsy(`incorrect ${i} isActive`);
            }
            expect(result.modifiedOffset).toBe(-5, 'incorrect offset');
        });

        it('must not shuffle when not looping', () => {
            const slides = [
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 1),
                new CarouselSlide(2, 2),
            ];
            const offset = 45;
            const slideWidth = 10;
            const viewportWidth = 100;
            const shouldLoop = false;
            const result = shuffleSlides(
                slides,
                offset,
                slideWidth,
                viewportWidth,
                items3,
                shouldLoop,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides === slides).toBeTruthy('slides should not change');
            expect(result.modifiedOffset).toBe(45, 'incorrect offset');
        });

        it('must return empty array whether slides are not present', () => {
            const emptyShuffle = shuffleSlides(
                [],
                0,
                0,
                0,
                [],
                false
            );
            expect(emptyShuffle.slides).toEqual([]);
            expect(emptyShuffle.modifiedOffset).toEqual(0);

            const undefinedShuffle = shuffleSlides(
                undefined,
                0,
                0,
                0,
                [],
                false
            );
            expect(undefinedShuffle.slides).toEqual([]);
            expect(undefinedShuffle.modifiedOffset).toEqual(0);
        });

        it('must mark copy slides', () => {
            const items = [0, 1, 2, 3];
            const slides = [
                new CarouselSlide(0, 1, {inViewport: true, item: items[1], isActive: false}),
                new CarouselSlide(0, 2, {inViewport: true, item: items[2], isActive: false}),
                new CarouselSlide(0, 3, {inViewport: true, item: items[3], isActive: false}),
                new CarouselSlide(0, 0, {inViewport: true, item: items[0], isActive: true}),
            ];
            const offset = 45;
            const slideWidth = 10;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                slides,
                offset,
                slideWidth,
                viewportWidth,
                items,
                shouldLoop,
            );
            expect(result.modifiedOffset).toBe(-5, 'incorrect offset');
            expect(result.slides.length).toBe(11, 'incorrect slides length');
            for (const slide of result.slides) {
                expect(slide.options.isCopy).toBeTruthy();
            }
        });
    });

    describe('moveOrCopySlidesToEnd test suite', () => {

        let slides5: CarouselSlide[];
        let items5: string[];

        beforeEach(() => {
            slides5 = [
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 1),
                new CarouselSlide(2, 2),
                new CarouselSlide(3, 3),
                new CarouselSlide(4, 4),
            ];
            items5 = ['a', 'b', 'c', 'd', 'e'];
        });

        it('must move slides to end', () => {
            const offset = 0;
            const quantity = 4;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd(
                slides5,
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(4, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(1, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(2, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(3, 'incorrect 4 item index');
            expect(result.modifiedOffset).toBe(20, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must move slide to end for quantity equals one', () => {
            const offset = 0;
            const quantity = 1;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd(
                slides5,
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(2, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(3, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(4, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(0, 'incorrect 4 item index');
            expect(result.modifiedOffset).toBe(5, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must move zero slides to end on negative quantity', () => {
            const offset = 0;
            const quantity = -1;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd(
                slides5,
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(3, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(4, 'incorrect 4 item index');
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must move zero slides to end on quantity is higher than slides length', () => {
            const items = ['a', 'b', 'c'];
            const slides = [
                new CarouselSlide(0, 0, {inViewport: true, item: items[0]}),
                new CarouselSlide(1, 1, {item: items[1]}),
                new CarouselSlide(2, 2, {item: items[2]}),
            ];
            const offset = 0;
            const quantity = 4;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd(
                slides,
                offset,
                quantity,
                slideWidth,
                items,
            );
            expect(result.slides.length).toBe(7, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(0, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(1, 'incorrect 4 item index');
            expect(result.slides[5].itemIndex).toBe(2, 'incorrect 5 item index');
            expect(result.slides[6].itemIndex).toBe(0, 'incorrect 6 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({inViewport: true, isCopy: true, item: items[0]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({isCopy: true, item: items[1]});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({isCopy: true, item: items[2]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({inViewport: true, isCopy: true, item: items[0], isActive: false});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({inViewport: true, isCopy: true, item: items[1], isActive: false});
            expect(result.slides[5].options)
                .withContext('incorrect 5 options')
                .toEqual({inViewport: true, isCopy: true, item: items[2], isActive: false});
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({inViewport: true, isCopy: true, item: items[0], isActive: false});
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must copy slides to end with viewport flag', () => {
            const offset = 0;
            const quantity = 3;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd([
                    new CarouselSlide(0, 0),
                    new CarouselSlide(1, 1, {inViewport: true}),
                    new CarouselSlide(2, 2),
                    new CarouselSlide(3, 3),
                    new CarouselSlide(4, 4),
                ],
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(7, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(2, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(3, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(4, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(0, 'incorrect 4 item index');
            expect(result.slides[5].itemIndex).toBe(1, 'incorrect 5 item index');
            expect(result.slides[6].itemIndex).toBe(2, 'incorrect 6 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({isCopy: true, inViewport: true});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({isCopy: true});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({});
            expect(result.slides[4].options)
               .withContext('incorrect 4 options')
                .toEqual({inViewport: true, isActive: false});
            expect(result.slides[5].options)
                .withContext('incorrect 5 options')
                .toEqual({isCopy: true, inViewport: true, isActive: false});
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({isCopy: true, inViewport: true, isActive: false});
            expect(result.modifiedOffset).toBe(5, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must fill remaining slides to end', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd([
                    new CarouselSlide(0, 0, {item: items5[0]}),
                    new CarouselSlide(1, 1, {item: items5[1]}),
                    new CarouselSlide(2, 2, {item: items5[2]}),
                ],
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(3, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(4, 'incorrect 4 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({item: items5[0]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({item: items5[1]});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({item: items5[2]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({isCopy: true, inViewport: true, item: items5[3], isActive: false});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({isCopy: true, inViewport: true, item: items5[4], isActive: false});
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(3);
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(4);
        });

        it('must fill and copy slides to end', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToEnd([
                    new CarouselSlide(0, 0, {item: items5[0], inViewport: true}),
                    new CarouselSlide(1, 1, {item: items5[1]}),
                ],
                offset,
                quantity,
                slideWidth,
                items,
            );
            expect(result.slides.length).toBe(4, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(0, 'incorrect 3 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({isCopy: true, inViewport: true, item: items[0]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({item: items[1]});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({isCopy: true, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({isCopy: true, inViewport: true, item: items[0], isActive: false});
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(2);
        });

        it('must fill and move slides to end', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToEnd([
                    new CarouselSlide(0, 0, {item: items5[0]}),
                    new CarouselSlide(1, 1, {item: items5[1]}),
                ],
                offset,
                quantity,
                slideWidth,
                items,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(2, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(0, 'incorrect 2 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({item: items[1]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({inViewport: true, isCopy: true, item: items[2], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({inViewport: true, item: items[0], isActive: false});
            expect(result.modifiedOffset).toBe(5, 'incorrect offset');
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(2);
        });
    });

    describe('moveOrCopySlidesToStart test suite', () => {

        let slides5: CarouselSlide[];
        let items5: string[];

        beforeEach(() => {
            slides5 = [
                new CarouselSlide(0, 0),
                new CarouselSlide(1, 1),
                new CarouselSlide(2, 2),
                new CarouselSlide(3, 3),
                new CarouselSlide(4, 4),
            ];
            items5 = ['a', 'b', 'c', 'd', 'e'];
        });

        it('must move slides to start', () => {
            const offset = 0;
            const quantity = 3;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart(
                slides5,
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(2, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(3, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(4, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(0, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(1, 'incorrect 4 item index');
            expect(result.modifiedOffset).toBe(-15, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must move zero slides to start on negative range', () => {
            const offset = 0;
            const quantity = -1;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart(
                slides5,
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(0, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(1, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(2, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(3, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(4, 'incorrect 4 item index');
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must copy slides to start on quantity is higher than slides length', () => {
            const items = ['a', 'b', 'c'];
            const slides = [
                new CarouselSlide(0, 0, {item: items[0]}),
                new CarouselSlide(1, 1, {item: items[1]}),
                new CarouselSlide(2, 2, {inViewport: true, item: items[2]}),
            ];
            const offset = 0;
            const quantity = 4;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart(
                slides,
                offset,
                quantity,
                slideWidth,
                items,
            );
            expect(result.slides.length).toBe(7, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(2, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(1, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(2, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(0, 'incorrect 4 item index');
            expect(result.slides[5].itemIndex).toBe(1, 'incorrect 5 item index');
            expect(result.slides[6].itemIndex).toBe(2, 'incorrect 6 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({inViewport: true, isCopy: true, item: items[2], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({inViewport: true, isCopy: true, item: items[0], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({inViewport: true, isCopy: true, item: items[1], isActive: false});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({inViewport: true, isCopy: true, item: items[2], isActive: false});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({isCopy: true, item: items[0]});
            expect(result.slides[5].options)
                .withContext('incorrect 5 options')
                .toEqual({isCopy: true, item: items[1]});
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({inViewport: true, isCopy: true, item: items[2]});
            expect(result.modifiedOffset).toBe(-20, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must move slide to start on range equals one', () => {
            const offset = 0;
            const quantity = 1;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart(
                slides5,
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length)
                .withContext('incorrect length')
                .toBe(5);
            expect(result.slides[0].itemIndex).toBe(4, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(0, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(1, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(2, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(3, 'incorrect 4 item index');
            expect(result.modifiedOffset).toBe(-5, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length)
                .withContext('incorrect unmarked items length')
                .toBe(0);
        });

        it('must copy slides to start with viewport flag in the middle', () => {
            const offset = 0;
            const quantity = 3;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart([
                    new CarouselSlide(0, 0),
                    new CarouselSlide(1, 1),
                    new CarouselSlide(2, 2),
                    new CarouselSlide(3, 3, {inViewport: true}),
                    new CarouselSlide(4, 4),
                ],
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(7, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(2, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(3, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(4, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(0, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(1, 'incorrect 4 item index');
            expect(result.slides[5].itemIndex).toBe(2, 'incorrect 5 item index');
            expect(result.slides[6].itemIndex).toBe(3, 'incorrect 6 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({isCopy: true, inViewport: true, isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({isCopy: true, inViewport: true, isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({inViewport: true, isActive: false});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({});
            expect(result.slides[5].options)
                .withContext('incorrect 5 options')
                .toEqual({isCopy: true});
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({isCopy: true, inViewport: true});
            expect(result.modifiedOffset).toBe(-15, 'incorrect offset');
            expect(result.unmarkedItemIndexes.length).toBe(0, 'incorrect unmarked items length');
        });

        it('must fill remaining slides to start', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart([
                    new CarouselSlide(0, 0, {item: items5[0]}),
                    new CarouselSlide(1, 1, {item: items5[1]}),
                    new CarouselSlide(2, 2, {item: items5[2]}),
                ],
                offset,
                quantity,
                slideWidth,
                items5,
            );
            expect(result.slides.length).toBe(5, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(3, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(4, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(0, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(1, 'incorrect 3 item index');
            expect(result.slides[4].itemIndex).toBe(2, 'incorrect 4 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({isCopy: true, inViewport: true, item: items5[3], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({isCopy: true, inViewport: true, item: items5[4], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({item: items5[0]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({item: items5[1]});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({item: items5[2]});
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(3);
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(4);
        });

        it('must fill and copy slides to start', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToStart([
                    new CarouselSlide(0, 0, {item: items5[0]}),
                    new CarouselSlide(1, 1, {item: items5[1], inViewport: true}),
                ],
                offset,
                quantity,
                slideWidth,
                items,
            );
            expect(result.slides.length).toBe(4, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(2, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(0, 'incorrect 2 item index');
            expect(result.slides[3].itemIndex).toBe(1, 'incorrect 3 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({isCopy: true, inViewport: true, item: items[1], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({isCopy: true, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({item: items[0]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({item: items[1], isCopy: true, inViewport: true});
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(2);
        });

        it('must fill and move slides to start', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToStart([
                    new CarouselSlide(0, 0, {item: items5[0]}),
                    new CarouselSlide(1, 1, {item: items5[1]}),
                ],
                offset,
                quantity,
                slideWidth,
                items,
            );
            expect(result.slides.length).toBe(3, 'incorrect length');
            expect(result.slides[0].itemIndex).toBe(1, 'incorrect 0 item index');
            expect(result.slides[1].itemIndex).toBe(2, 'incorrect 1 item index');
            expect(result.slides[2].itemIndex).toBe(0, 'incorrect 2 item index');
            expect(result.slides[0].options)
                .withContext('incorrect 0 options')
                .toEqual({inViewport: true, item: items[1], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({inViewport: true, isCopy: true, item: items[2], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({item: items[0]});
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
            expect(result.unmarkedItemIndexes)
                .withContext('incorrect unmarked items')
                .toContain(2);
        });
    });

});
