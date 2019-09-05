import { Injectable, Inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class HammerService {

    private hammerAbsenceDeclared = false;

    constructor(
        // tslint:disable-next-line: ban-types
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
    }

    public managerFor(element: HTMLElement): HammerManager | null {
        const hasGestures = isPlatformBrowser(this.platformId) && (window as any).Hammer;
        if (!hasGestures) {
            if (isDevMode() && !this.hammerAbsenceDeclared) {
                console.warn(
                    'Ng-carousel could not listen to drag, because HammerJS was not found. Either disable drag or import HammerJS.'
                );
                this.hammerAbsenceDeclared = true;
            }

            return null;
        }
        const hammerManager = new Hammer(element);

        return hammerManager;
    }
}
