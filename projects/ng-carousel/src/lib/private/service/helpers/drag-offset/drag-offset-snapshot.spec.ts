import { CarouselAlignMode } from '../../../../carousel-align-mode';
import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { dragOffsetSnapshot } from './drag-offset-snapshot';

describe('dragOffsetSnapshot test suite', () => {

    // Imitate y = 2x function so we can predict results
    const bezierFn = (x: number) => x / 2;
    const invertedBezierFn = (x: number) => x * 2;
    const maxOverscrollPercent = 20;

    it('must add desired delta to looped carousel dragging right', () => {
        const fromX = 30;
        const toX = 40;
        const offset = -5;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = true;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 120;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(5, 'incorrect modified offset');
    });

    it('must add desired delta to looped carousel dragging left', () => {
        const fromX = 40;
        const toX = 30;
        const offset = -5;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = true;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 120;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-15, 'incorrect modified offset');
    });

    it('must travel from safe side to safe side', () => {
        const fromX = 40;
        const toX = 30;
        const offset = -5;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 200;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-15, 'incorrect modified offset');
    });

    it('must travel from left safe zone to left overscroll while dragging to the right', () => {
        const fromX = 40;
        const toX = 51;
        const offset = -5;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 200;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(0.6, 'incorrect modified offset');
    });

    it('must travel from right safe zone to right overscroll while dragging to the left', () => {
        const fromX = 60;
        const toX = 49;
        const offset = -5;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 110;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-10.6, 'incorrect modified offset');
    });

    it('must travel from overscroll zone to safe zone with left direction', () => {
        const fromX = 60;
        const toX = 30;
        const offset = 1;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 200;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-20, 'incorrect modified offset');
    });

    it('must travel from overscroll zone to safe zone with right direction', () => {
        const fromX = 30;
        const toX = 60;
        const offset = -51;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 150;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-30, 'incorrect modified offset');
    });

    it('must travel from left overscroll to right overscroll', () => {
        const fromX = 60;
        const toX = 30;
        const offset = 1;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 100;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-2, 'incorrect modified offset');
    });

    it('must travel from right overscroll to left overscroll', () => {
        const fromX = 30;
        const toX = 60;
        const offset = -1;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const slideWidth = 10;
        const slideSumWidth = 100;
        const viewportWidth = 100;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(2, 'incorrect modified offset');
    });

    it('must travel from left overscroll to left overscroll', () => {
        const fromX = 60;
        const toX = 55;
        const offset = 1;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 100;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(0.5, 'incorrect modified offset');
    });

    it('must travel from right overscroll to right overscroll', () => {
        const fromX = 30;
        const toX = 35;
        const offset = -1;
        const widthMode = CarouselWidthMode.PX;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 100;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-0.5, 'incorrect modified offset');
    });

    it('must calculate drag for centered carousel from safe zone with overscroll', () => {
        const fromXPercents = 50;
        const toXPercents = 100;
        const viewportWidthInPx = 1400;

        const fromX = viewportWidthInPx / 100 * fromXPercents;
        const toX = viewportWidthInPx / 100 * toXPercents;
        const offset = 40;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.CENTER;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 30;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(49.5, 'incorrect offset');
    });

    it('must calculate for centered carousel from safe zone to overscroll zone', () => {
        const fromX = 40;
        const toX = 50;
        const offset = 45;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.CENTER;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 30;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(46, 'incorrect offset');
    });

    it('must calculate for centered carousel from safe zone to safe zone', () => {
        const fromX = 40;
        const toX = 30;
        const offset = 45;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.CENTER;
        const shouldLoop = false;
        const viewportWidth = 100;
        const slideWidth = 10;
        const slideSumWidth = 30;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidth,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(35, 'incorrect offset');
    });

    it('must calculate correctly with percent carousel', () => {
        const fromX = 800;
        const toX = 1200;
        const offset = 1;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 2000;
        const slideWidth = 10;
        const slideSumWidth = 200;
        const initialX = 20; // 400 in pixels, 20 in percent: initialX always aligned to current width mode
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(3, 'incorrect modified offset');
    });

    it('should travel from left overscroll zone to left overscroll zone with dragging to the right', () => {
        const fromX = 60;
        const toX = 80;
        const offset = 5;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 200;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(7, 'incorrect modified offset');
    });

    it('should calculate overscroll distance on unknown initialX with reaching drag border', () => {
        const fromX = 60;
        const toX = 280;
        const offset = 5;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 200;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(10, 'incorrect modified offset');
    });

    it('should calculate for left-centered carousels with slide sum width lesser than viewport and positive offset', () => {
        const fromX = 60;
        const toX = 100;
        const offset = 0;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 50;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(4, 'incorrect modified offset');
    });

    it('should calculate for left-centered carousels with slide sum width lesser than viewport and negative offset', () => {
        const fromX = 100;
        const toX = 60;
        const offset = 0;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 50;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(-4, 'incorrect modified offset');
    });

    it('should calculate for left-centered carousels with slide sum width lesser than viewport with existing offset', () => {
        const fromX = 60;
        const toX = 100;
        const offset = 1;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.LEFT;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 50;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(5, 'incorrect modified offset');
    });

    it('should calculate for centered carousels with slide sum width lesser than viewport and negative offset', () => {
        const fromX = 100;
        const toX = 60;
        const offset = 45;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.CENTER;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 10;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(41, 'incorrect modified offset');
    });

    it('should calculate for centered carousels with slide sum width lesser than viewport and positive offset', () => {
        const fromX = 60;
        const toX = 100;
        const offset = 45;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.CENTER;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 10;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(49, 'incorrect modified offset');
    });

    it('should avoid calculation when no offset present', () => {
        const fromX = 2;
        const toX = 2;
        const offset = 45;
        const widthMode = CarouselWidthMode.PERCENT;
        const alignMode = CarouselAlignMode.CENTER;
        const shouldLoop = false;
        const viewportWidth = 100;
        const viewportWidthInPx = 100;
        const slideWidth = 10;
        const slideSumWidth = 10;
        const result = dragOffsetSnapshot(
            fromX,
            toX,
            offset,
            widthMode,
            alignMode,
            shouldLoop,
            viewportWidth,
            viewportWidthInPx,
            slideWidth,
            slideSumWidth,
            maxOverscrollPercent,
            bezierFn,
            invertedBezierFn,
        );
        expect(result).toBe(45, 'incorrect modified offset');
    });
});
