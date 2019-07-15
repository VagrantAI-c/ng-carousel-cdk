import { CarouselSlide } from '../../models/carousel-slide';

/**
 * Returns cloned slides with modified `inViewport` and `isActive` fields
 */
export function markVisibleAndActive(
    slides: CarouselSlide[],
    offset: number,
    slideWidth: number,
    viewportWidth: number,
    activeSlideIndex: number,
): CarouselSlide[] {
    if (!slides || !slides.length) {

        return [];
    }

    const newSlides: CarouselSlide[] = [];
    for (let i = 0, currentOffset = offset; i < slides.length; i++, currentOffset += slideWidth) {
        const newSlide = new CarouselSlide(
            slides[i].id,
            slides[i].itemIndex,
            Object.assign(
                {},
                slides[i].options,
                {
                    inViewport: currentOffset < viewportWidth && currentOffset + slideWidth > 0,
                    isActive: i === activeSlideIndex,
                },
            ),
        );
        newSlides.push(newSlide);
    }

    return newSlides;
}
