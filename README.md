# ng-carousel-cdk
Basic carousel engine on Angular

## Demo
https://vagrantai-c.github.io/ng-carousel-cdk/

## Requirements
Angular version 7 or higher

## Install
```
npm i ng-carousel-cdk
```

### Additional installs
- Hammer should be additionaly provided by user whether drag is wanted to be supported.
    ```
    npm i hammerjs
    ```
- After install, provide `hammerjs` in `main.ts` file:
    ```
    import 'hammerjs';
    ```

## Usage
1. Import carousel in module
    ```typescript
    import { CarouselModule } from 'ng-carousel-cdk';

    @NgModule({
        imports: [
            CarouselModule
        ],
    })
    export class AnyModule { }
    ```
2. Apply it in component

    Component:
    ```typescript
    const config: CarouselConfig = {
        items: [
            {name: 1},
            {name: 2},
            {name: 3},  
        ],
    }
    ```

    Template:
    ```HTML
    <ng-carousel [config]="config">
        <ng-template ngCarouselSlide let-item>
            {{item.name}}
        </ng-template>
    </ng-carousel>
    ```

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

- `$implicit`: injected item
- `itemIndex`: item index of current slide
- `isActive`: whether slide is currently active
- `inViewport`: whether slide is currently visible (at least 1 pixel is in viewport)

#### Inputs

`config: CarouselConfig`

Possible options:

-
    ```typescript
    items: any[] = [];
    ```
    Items to be rendered inside carouse
-
    ```typescript
    slideWidth = 100;
    ```
    All slides have same width and this field specifies it
-
    ```typescript
    widthMode: CarouselWidthMode = CarouselWidthMode.PERCENT;
    ```
    How `slideWidth` should interpret its value, whether in pixels or percents
-
    ```typescript
    alignMode: CarouselAlignMode = CarouselAlignMode.CENTER;
    ```
    Regulates where active slide should be place
-
    ```typescript
    autoplayEnabled = true;
    ```
    Whether active slide should change over time
-
    ```typscript
    autoplayDelay = 6000;
    ```
    Specifies how often active slide should change. Only applied if `autoplayEnabled` is set to true
-
    ```typescript
    dragEnabled = true;
    ```
    Whether drag is enabled. Be adviced that drag only available when hammerjs is installed
-
    ```typescript
    shouldLoop = true;
    ```
    Whether carousel is allowed to copy slides in order to fill empty space
-
    ```typescript
    transitionDuration = 280;
    ```
    Animation duration on slide change
-
    ```typescript
    shouldRecalculateOnResize = true;
    ```
    Whether carousel should recalculate upon window resize. Useful when carousel takes full page width or carousel width is relative to viewport width (either in `%` or `vw`)

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
- `carouselRef.recalculate()`: recalculate positions

### PreventGhostClickDirective

selector: `[ngCarouselPreventGhostClick]`

#### Usage
Use directive on button, anchor or any clickable element. This will prevent ghost clicks after pan ends.

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