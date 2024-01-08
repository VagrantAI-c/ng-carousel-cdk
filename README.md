# ng-carousel-cdk
Basic carousel engine on Angular

## Demo
https://vagrantai-c.github.io/ng-carousel-cdk/

## Requirements
Current major version of Angular. Package might work on Angular version 9 or higher, but not guaranteed

## Install
```
npm i ng-carousel-cdk
```

## Usage
1. Import carousel in module
    ```typescript
    import { CarouselModule } from 'ng-carousel-cdk';

    @NgModule({
        imports: [
            CarouselModule,
        ],
    })
    export class AnyModule { }
    ```
2. Apply it in component

    Component:
    ```typescript
    interface CarouselItem {
        name: number;
    }

    ...

    const config: CarouselConfig<CarouselItem> = {
        items: [
            {name: 1},
            {name: 2},
            {name: 3},
        ],
    }
    ```

    Template:
    ```HTML
    <ng-carousel
        #carouselRef="ngCarousel"
        [config]="config">
        <ng-template
            [ngCarouselSlide]="carouselRef"
            let-item>
            {{item.name}}
        </ng-template>
    </ng-carousel>
    ```
Providing a carousel reference to `ngCarouselSlide` is optional, but gives a type defense for `$implicit` variable

## API

### `CarouselComponent`
Selector: `ng-carousel`

Exported as `ngCarousel`

#### Slide declaration
Use template with `ngCarouselSlide` directive applied to declare slide template. Every item provided within carousel config would be injected into it. Example:
```html
<ng-carousel>
    <ng-template
        ngCarouselSlide
        let-item
        let-index="itemIndex"
        let-isActive="isActive"
        let-inViewport="inViewport">
        Slide №{{index}} content
    </ng-template>
</ng-carousel>
```
Template is enriched with next context structure:

- `$implicit`: injected item, would have correct type if carousel reference is provided to `ngCarouselSlide` input
- `itemIndex`: item index of current slide
- `isActive`: whether slide is currently active
- `inViewport`: whether slide is currently visible (at least 1 pixel is in viewport)
- `activeOnTheLeft`: whether active slide is currently to the left of the current one
- `activeOnTheRight`: whether active slide is currently to the right of the current one

Template variables can (and should) be typed with carousel input:
```typescript
readonly config: CarouselConfig<number> = {
    ...,
    items: [1, 2, 3],
}
```

```html
<ng-carousel
    #carouselRef="ngCarousel"
    [config]="config">
    <ng-template
        [ngCarouselSlide]="carouselRef"
        let-item>
        Slide №{{index}} content
    </ng-template>
</ng-carousel>
```
`item` ng-template variable would have a correct type of `number`

#### Inputs

`config: CarouselConfig`

Possible options and their default values:

-
    ```typescript
    items: T[] = [];
    ```
    Items to be rendered inside carousel.
-
    ```typescript
    items$: Observable<T[]> = NEVER;
    ```
    Stream of items to be rendered inside carousel. If both `items` and `items$` are present, first `items` would be used synchronously and then there would be a subscription to `items$`.
-
    ```typescript
    slideWidth = 100;
    ```
    All slides have same width and this field specifies it.
-
    ```typescript
    widthMode: CarouselWidthMode = CarouselWidthMode.PERCENT;
    ```
    How `slideWidth` should interpret its value, whether in pixels or percents.
-
    ```typescript
    alignMode: CarouselAlignMode = CarouselAlignMode.CENTER;
    ```
    Regulates where active slide should be place.
-
    ```typescript
    autoplayEnabled = true;
    ```
    Whether active slide should change over time.
-
    ```typscript
    autoplayDelay = 6000;
    ```
    Specifies how often active slide should change. Only applied if `autoplayEnabled` is set to true.
-
    ```typescript
    dragEnabled = true;
    ```
    Whether drag is enabled.
-
    ```typescript
    shouldLoop = true;
    ```
    Whether carousel is allowed to copy slides in order to fill empty space.
-
    ```typescript
    transitionDuration = 280;
    ```
    Animation duration on slide change.
-
    ```typescript
    shouldRecalculateOnResize = true;
    ```
    Whether carousel should recalculate upon window resize. Useful when carousel takes full page width or carousel width is relative to viewport width (either in `%` or `vw`).
-
    ```typescript
    recalculateDebounce = 300;
    ```
    Specifies time for which carousel would wait after resize event to recalculate its positions. 0 means no debounce is applied.
-
    ```typescript
    allowKeyboardNavigation = true;
    ```
    Whether carousel shoul listen to arrow keypresses and navigate to prev and next slide accordingly after left or right arrow key is pressed.

#### Outputs
`itemIndexChange`

Emits number of item index upon active slide changes

#### API

One can export carousel via `exportAs` or `@ViewChild` syntax.

Template
```html
<ng-carousel #carouselRef="ngCarousel"></ng-carousel>
```

or

```typescript
@ViewChild(CarouselComponent) carouselRef: CarouselComponent;
```

Use this reference to programmaticaly trigger next events:
- `carouselRef.next()`: increment active slide
- `carouselRef.prev()`: decrement active slide
- `carouselRef.setIndex(newIndex: number)`: focus slide with provided item index. When no slides are available, index change would postpone till slide initialization.
- `carouselRef.recalculate()`: recalculate positions. Might be useful when `shouldRecalculateOnResize` is turned off and carousel width mode is `CarouselWidthMode.PX` (pixels).
- `carouselRef.slideIndex`: returns current active slide index, might be useful for composing paginators
- `carouselRef.items`: returns unwrapped set of items. It might be helpful to syncrhonously obtain list of items when `items$` config field is used

### PreventGhostClickDirective

selector: `[ngCarouselPreventGhostClick]`

#### Usage
Use directive on button, anchor or any clickable/draggable element. This will prevent ghost clicks after pan ends.

```HTML
<ng-carousel>
    <button
        (click)="processClick($event)"
        ngCarouselPreventGhostClick>
        ...
    </button>
</ng-carousel>
```
When drag starts on button element, it won't be clicked upon drag end.

#### Usage on custom carousels
```HTML
<!-- Put element selector on draggable containers -->
<ul #dragContainer>
    <!-- Carousel slide -->
    <li>
        <!-- Interactive element -->
        <a
            [ngCarouselPreventGhostClick]="dragContainer"
            href="...">
            ...
        </a>
    </li>
</ul>
```
