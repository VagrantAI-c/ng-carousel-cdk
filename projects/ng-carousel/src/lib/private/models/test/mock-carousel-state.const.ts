import { CarouselConfig } from '../../../carousel-config';
import { CarouselAutoplay } from '../carousel-autoplay';
import { CarouselState } from '../carousel-state';

export const MOCK_CAROUSEL_STATE: CarouselState = {
  activeItemIndex: 0,
  activeSlideIndex: 0,
  animatableContainer: null,
  animation: null,
  animationBezierFn: null,
  dragBezierFn: null,
  invertedDragBezierFn: null,
  autoplay: new CarouselAutoplay(),
  config: new CarouselConfig(),
  initializationState: {
    configInitialized: false,
    firstInitalization: false,
    viewportWidthInitialized: false,
  },
  isDragged: false,
  offset: 0,
  postponedItemIndex: null,
  slides: [],
  template: null,
  widthContainer: null,
};
