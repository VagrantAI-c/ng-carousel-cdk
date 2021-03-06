import { ElementRef, EmbeddedViewRef, TemplateRef } from '@angular/core';

import { CarouselState } from '../../../models/carousel-state';
import { setTemplateProcedure } from './set-template-procedure';

describe('setTemplateProcedure test suite', () => {

    class TemplateRefImpl implements TemplateRef<any> {
        get elementRef(): ElementRef {
            return {
                nativeElement: null,
            };
        }

        createEmbeddedView(): EmbeddedViewRef<any> {
            return {
                context: null,
                rootNodes: [],
                destroyed: false,
                destroy: () => {},
                checkNoChanges: () => {},
                detach: () => {},
                detectChanges: () => {},
                markForCheck: () => {},
                onDestroy: () => {},
                reattach: () => {},
            };
        }
    }

    it('should assign template', () => {
        const templateRef = new TemplateRefImpl();
        const procedure = setTemplateProcedure(templateRef);
        const state = new CarouselState();
        expect(procedure({state, environment: {}, procedureState: {}}).state.template).toBe(templateRef);
    });

    it('should assign null', () => {
        const procedure = setTemplateProcedure(null);
        const state = new CarouselState();
        expect(procedure({state, environment: {}, procedureState: {}}).state.template).toBe(null);
    });

});
