import { CarouselWidthMode } from '../../../../carousel-width-mode';
import { CarouselAnimation } from '../../../models/carousel-animation';

export function startAnimation(
    container: HTMLElement | null,
    from: number | null,
    to: number,
    widthMode: CarouselWidthMode,
    transitionDuration: number,
    bezierArgs: number[],
    isBrowser: boolean,
    afterAnimationAction: () => void,
): CarouselAnimation | null {
    if (!isBrowser || !container || from === null) {

        return null;
    }

    const cubicBezier = `cubic-bezier(${bezierArgs[0]},${bezierArgs[1]},${bezierArgs[2]},${bezierArgs[3]})`;
    const animationNative = container?.animate?.([
        { transform: `translateX(${from}${widthMode})` },
        { transform: `translateX(${to}${widthMode})` },
    ], {
        duration: transitionDuration,
        easing: cubicBezier,
    });
    if (animationNative) {
        animationNative.onfinish = () => {
            afterAnimationAction();
        }
    }
    const animation = new CarouselAnimation(
        from,
        to,
        animationNative,
    );
    animationNative?.play?.();

    return animation;
}
