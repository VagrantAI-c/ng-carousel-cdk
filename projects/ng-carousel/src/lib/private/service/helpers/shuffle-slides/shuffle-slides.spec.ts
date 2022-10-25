import { CarouselSlide } from '../../../models/carousel-slide';
import { MOCK_SLIDE_PARAMS } from '../../../models/test/mock-slide-params.const';
import { moveOrCopySlidesToEnd, moveOrCopySlidesToStart, shuffleSlides } from './shuffle-slides';

describe('weight calculation test suite', () => {

    describe('shuffleSlides test suite', () => {

        let slides3: CarouselSlide[];
        let items3: any[];
        let slides6: CarouselSlide[];
        let items6: any[];

        beforeEach(() => {
            slides3 = [
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
            ];
            items3 = [1, 2, 3];
            slides6 = [
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
                new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
                new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
                new CarouselSlide(5, 5, MOCK_SLIDE_PARAMS),
            ];
            items6 = [1, 2, 3, 4, 5, 6];
        });

        it('must not shuffle when there is no need to mix', () => {
            /*
                0%                         100%
                [    40    ][    40    ][    |40    ]
                   slide 0     slide 1     slide 2

                - balance is fine, no shuffle required
            */
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
            expect(result.slidesChanged).toBe(false, 'incorrect slide change flag');
        });

        it('must shuffle with offset', () => {
            /*
                0%                  100%
                |  [      90      ][  |  90      ][      90      ]
                  5%    slide 0        slide 1         slide 2

                - slide 2 expected to be shuffled to the right slide
                - offset change from 5 to -85
            */
            const modifiedOffset = 5;
            const slideWidth = 90;
            const viewportWidth = 100;
            slides3[0] = new CarouselSlide(
                slides3[0].id,
                slides3[0].itemIndex,
                {...slides3[0].options, inViewport: true},
            );
            slides3[1] = new CarouselSlide(
                slides3[1].id,
                slides3[1].itemIndex,
                {...slides3[0].options, inViewport: true},
            );
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
            expect(result.slides[0].options?.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.modifiedOffset).toBe(-85, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must move slides from right side', () => {
            /*
                0%                               100%
                |      [      40      ][     40    |  ][      40      ]
                      30%   slide 0        slide 1          slide 2

                - slide 2 expected to be shuffled to the left side
            */
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
            expect(result.slides[0].options?.inViewport).toBeTruthy('incorrect 0 inViewport');
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must copy from right side if there are no donors', () => {
            const modifiedOffset = 19;
            const slideWidth = 40;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, inViewport: true}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, inViewport: true}),
                    new CarouselSlide(2, 2, {...MOCK_SLIDE_PARAMS, inViewport: true}),
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(false, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(false, 'incorrect slide change flag');
        });

        it('must shuffle two full-width slides with drag intent', () => {
            // User started a drag and moved slide 1px left
            const modifiedOffset = -11;
            const slideWidth = 10;
            const viewportWidth = 10;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, inViewport: true}),
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must copy slides to both sides', () => {
            const modifiedOffset = 40;
            const slideWidth = 20;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, inViewport: true}),
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
                expect(result.slides[i].options.inViewport).toBeTruthy(`incorrect ${i} inViewport`);
            }
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(false, 'incorrect slide change flag');
        });

        it('must have only one active slide', () => {
            const offset = 45;
            const slideWidth = 10;
            const viewportWidth = 100;
            const shouldLoop = true;
            const result = shuffleSlides(
                [
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, isActive: true, inViewport: true}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, inViewport: true}),
                    new CarouselSlide(2, 2, {...MOCK_SLIDE_PARAMS, inViewport: true}),
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must not shuffle when not looping', () => {
            const slides = [
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
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
            expect(result.slidesChanged).toBe(false, 'incorrect slide change flag');
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
            expect(emptyShuffle.slidesChanged).toBe(false, 'incorrect slide change flag');
        });

        it('must mark copy slides', () => {
            const items = [0, 1, 2, 3];
            const slides = [
                new CarouselSlide(0, 1, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[1], isActive: false}),
                new CarouselSlide(0, 2, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false}),
                new CarouselSlide(0, 3, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[3], isActive: false}),
                new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0], isActive: true}),
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must move slide to the right with active threshold', () => {
            const items = [0, 1, 2];
            // Imagine slide transition from slide 1 to slide 2.
            // We expect slide 0 to move to the end
            const slides = [
                new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, inViewport: false, item: items[0], isActive: false}),
                new CarouselSlide(0, 1, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[1], isActive: false}),
                new CarouselSlide(0, 2, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: true}),
            ];
            const offset = -200;
            const slideWidth = 100;
            const viewportWidth = 100;
            const shouldLoop = true;
            const threshold = 5;
            const result = shuffleSlides(
                slides,
                offset,
                slideWidth,
                viewportWidth,
                items,
                shouldLoop,
                threshold,
            );
            expect(result.modifiedOffset).toBe(-100, 'incorrect offset');
            expect(result.slides.length).toBe(3, 'incorrect slides length');
            expect(result.slides[0].itemIndex).toBe(1);
            expect(result.slides[1].itemIndex).toBe(2);
            expect(result.slides[2].itemIndex).toBe(0);
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must move slide to the left with active threshold', () => {
            const items = [0, 1, 2];
            // Imagine slide transition from slide 1 to slide 2.
            // We expect slide 0 to move to the end
            const slides = [
                new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0], isActive: true}),
                new CarouselSlide(0, 1, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[1], isActive: false}),
                new CarouselSlide(0, 2, {...MOCK_SLIDE_PARAMS, inViewport: false, item: items[2], isActive: false}),
            ];
            const offset = 0;
            const slideWidth = 100;
            const viewportWidth = 100;
            const shouldLoop = true;
            const threshold = 5;
            const result = shuffleSlides(
                slides,
                offset,
                slideWidth,
                viewportWidth,
                items,
                shouldLoop,
                threshold,
            );
            expect(result.modifiedOffset).toBe(-100, 'incorrect offset');
            expect(result.slides.length).toBe(3, 'incorrect slides length');
            expect(result.slides[0].itemIndex).toBe(2);
            expect(result.slides[1].itemIndex).toBe(0);
            expect(result.slides[2].itemIndex).toBe(1);
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

    });

    describe('moveOrCopySlidesToEnd test suite', () => {

        let slides5: CarouselSlide[];
        let items5: string[];

        beforeEach(() => {
            slides5 = [
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
                new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
                new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(false, 'incorrect slide change flag');
        });

        it('must move zero slides to end on quantity is higher than slides length', () => {
            const items = ['a', 'b', 'c'];
            const slides = [
                new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0]}),
                new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items[1]}),
                new CarouselSlide(2, 2, {...MOCK_SLIDE_PARAMS, item: items[2]}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[1]});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[2]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0], isActive: false});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[1], isActive: false});
            expect(result.slides[5].options)
                .withContext('incorrect 5 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0], isActive: false});
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must copy slides to end with viewport flag', () => {
            const offset = 0;
            const quantity = 3;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd(
                [
                    new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, inViewport: true}),
                    new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
                    new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
                    new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual(MOCK_SLIDE_PARAMS);
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual(MOCK_SLIDE_PARAMS);
            expect(result.slides[4].options)
               .withContext('incorrect 4 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, isActive: false});
            expect(result.slides[5].options)
                .withContext('incorrect 5 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, isActive: false});
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, isActive: false});
            expect(result.modifiedOffset).toBe(5, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must fill remaining slides to end', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const result = moveOrCopySlidesToEnd(
                [
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, item: items5[0]}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items5[1]}),
                    new CarouselSlide(2, 2, {...MOCK_SLIDE_PARAMS, item: items5[2]}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, item: items5[0]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items5[1]});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items5[2]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items5[3], isActive: false});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items5[4], isActive: false});
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must fill and copy slides to end', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToEnd(
                [
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, item: items5[0], inViewport: true}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items5[1]}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[1]});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0], isActive: false});
            expect(result.modifiedOffset).toBe(0, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must fill and move slides to end', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToEnd(
                [
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, item: items5[0]}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items5[1]}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[1]});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0], isActive: false});
            expect(result.modifiedOffset).toBe(5, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });
    });

    describe('moveOrCopySlidesToStart test suite', () => {

        let slides5: CarouselSlide[];
        let items5: string[];

        beforeEach(() => {
            slides5 = [
                new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
                new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
                new CarouselSlide(3, 3, MOCK_SLIDE_PARAMS),
                new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(false, 'incorrect slide change flag');
        });

        it('must copy slides to start on quantity is higher than slides length', () => {
            const items = ['a', 'b', 'c'];
            const slides = [
                new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, item: items[0]}),
                new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items[1]}),
                new CarouselSlide(2, 2, {...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2]}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[0], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[1], isActive: false});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[0]});
            expect(result.slides[5].options)
                .withContext('incorrect 5 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[1]});
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2]});
            expect(result.modifiedOffset).toBe(-20, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
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
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must copy slides to start with viewport flag in the middle', () => {
            const offset = 0;
            const quantity = 3;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart(
                [
                    new CarouselSlide(0, 0, MOCK_SLIDE_PARAMS),
                    new CarouselSlide(1, 1, MOCK_SLIDE_PARAMS),
                    new CarouselSlide(2, 2, MOCK_SLIDE_PARAMS),
                    new CarouselSlide(3, 3, {...MOCK_SLIDE_PARAMS, inViewport: true}),
                    new CarouselSlide(4, 4, MOCK_SLIDE_PARAMS),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, isActive: false});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual(MOCK_SLIDE_PARAMS);
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual(MOCK_SLIDE_PARAMS);
            expect(result.slides[6].options)
                .withContext('incorrect 6 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true});
            expect(result.modifiedOffset).toBe(-15, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must fill remaining slides to start', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const result = moveOrCopySlidesToStart([
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, item: items5[0]}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items5[1]}),
                    new CarouselSlide(2, 2, {...MOCK_SLIDE_PARAMS, item: items5[2]}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items5[3], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items5[4], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items5[0]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items5[1]});
            expect(result.slides[4].options)
                .withContext('incorrect 4 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items5[2]});
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must fill and copy slides to start', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToStart([
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, item: items5[0]}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items5[1], inViewport: true}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[1], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[0]});
            expect(result.slides[3].options)
                .withContext('incorrect 3 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[1], inViewport: true});
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });

        it('must fill and move slides to start', () => {
            const offset = 0;
            const quantity = 2;
            const slideWidth = 5;
            const items = ['a', 'b', 'c'];
            const result = moveOrCopySlidesToStart(
                [
                    new CarouselSlide(0, 0, {...MOCK_SLIDE_PARAMS, item: items5[0]}),
                    new CarouselSlide(1, 1, {...MOCK_SLIDE_PARAMS, item: items5[1]}),
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
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[1], isActive: false});
            expect(result.slides[1].options)
                .withContext('incorrect 1 options')
                .toEqual({...MOCK_SLIDE_PARAMS, inViewport: true, item: items[2], isActive: false});
            expect(result.slides[2].options)
                .withContext('incorrect 2 options')
                .toEqual({...MOCK_SLIDE_PARAMS, item: items[0]});
            expect(result.modifiedOffset).toBe(-10, 'incorrect offset');
            expect(result.slidesChanged).toBe(true, 'incorrect slide change flag');
        });
    });

});
