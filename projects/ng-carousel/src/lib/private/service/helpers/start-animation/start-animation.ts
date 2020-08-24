import { animate, AnimationBuilder, style } from '@angular/animations';
import { bindCallback } from 'rxjs';

import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { CarouselAnimation } from '../../../models/carousel-animation';

export function startAnimation(
    container: HTMLElement,
    from: number,
    to: number,
    widthMode: CarouselWidthMode,
    transitionDuration: number,
    bezierArgs: number[],
    isBrowser: boolean,
    afterAnimationAction: () => void,
    animationBuilder: AnimationBuilder,
): CarouselAnimation {
    if (!isBrowser) {

        return null;
    }

    const cubicBezier = `cubic-bezier(${bezierArgs[0]},${bezierArgs[1]},${bezierArgs[2]},${bezierArgs[3]})`;
    const animationFactory = animationBuilder.build([
        style({
            transform: `translateX(${from}${widthMode})`,
        }),
        animate(`${transitionDuration}ms ${cubicBezier}`, style({
            transform: `translateX(${to}${widthMode})`,
        })),
    ]);
    const animationPlayer = animationFactory.create(container);
    // Wrap onDone into observable
    const boundFunction = bindCallback(animationPlayer.onDone); // Wrap function into function that returns observable
    const onDone$ = boundFunction.call(animationPlayer); // Receive observable with context of animation player
    const subscription$ = onDone$
        .subscribe(() => {
            animationPlayer.destroy();
            afterAnimationAction();
        });
    const animation = new CarouselAnimation(
        from,
        to,
        animationPlayer,
        subscription$,
    );
    animationPlayer.play();

    return animation;
}
