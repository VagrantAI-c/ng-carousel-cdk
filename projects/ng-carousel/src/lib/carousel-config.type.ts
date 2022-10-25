import { CompleteCarouselConfig } from './private/models/carousel-config';

type Nullable<T> = { [K in keyof T]?: T[K] | null; };

export type CarouselConfig<T = any> = Nullable<CompleteCarouselConfig<T>>;
