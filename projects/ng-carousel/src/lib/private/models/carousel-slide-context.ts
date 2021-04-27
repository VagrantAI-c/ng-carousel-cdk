/**
 * Template context for carousel slide
 */
export interface CarouselSlideContext<T> {

    $implicit: T | null;
    itemIndex: number;
    isActive: boolean;
    inViewport: boolean;
    activeOnTheLeft: boolean;
    activeOnTheRight: boolean;

}
