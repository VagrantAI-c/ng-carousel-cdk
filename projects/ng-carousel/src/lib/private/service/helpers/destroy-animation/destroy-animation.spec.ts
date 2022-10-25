import { CarouselAnimation } from '../../../models/carousel-animation';
import { destroyAnimation } from './destroy-animation';

class MockAnimation implements Animation {
    currentTime: number | null = 0;
    effect: AnimationEffect | null = null;
    cancel(): void {}
    commitStyles(): void {}
    finish(): void {}
    addEventListener<K extends keyof AnimationEventMap>(type: K, listener: (this: Animation, ev: AnimationEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: unknown, listener: unknown, options?: unknown): void {}
    dispatchEvent(event: Event): boolean { return true; }
    finished: Promise<Animation> = Promise.resolve(this);
    id: string = '1';
    oncancel: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null = null;
    onfinish: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null = null;
    onremove: ((this: Animation, ev: Event) => any) | null = null;
    pending: boolean = false;
    playState: AnimationPlayState = 'running';
    playbackRate: number = 1;
    ready: Promise<Animation> = Promise.resolve(this);
    replaceState: AnimationReplaceState = 'active';
    startTime: number | null = null;
    timeline: AnimationTimeline | null = null;
    pause(): void {}
    persist(): void {}
    play(): void {}
    reverse(): void {}
    updatePlaybackRate(playbackRate: number): void {}
    removeEventListener<K extends keyof AnimationEventMap>(type: K, listener: (this: Animation, ev: AnimationEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
    removeEventListener(type: unknown, listener: unknown, options?: unknown): void {}
}

describe('destroyAnimation test suite', () => {

    it('should destroy player', () => {
        const mockAnimation = new MockAnimation();
        spyOn(mockAnimation, 'finish');
        spyOn(mockAnimation, 'cancel');
        const animation = new CarouselAnimation(
            0,
            0,
            mockAnimation,
        );
        destroyAnimation(animation);
        expect(mockAnimation.cancel).toHaveBeenCalledTimes(1);
        expect(mockAnimation.finish).toHaveBeenCalledTimes(0);
    });

    it('should not crash upon null animation', () => {
        expect(() => destroyAnimation(null)).not.toThrow();
    });
});
