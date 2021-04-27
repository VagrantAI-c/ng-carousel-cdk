import { TemplateRef } from '@angular/core';
import { CarouselState } from '../../../models/carousel-state';

import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Assigns TemplateRef where slides would be rendered
 */
export function setTemplateProcedure(template: TemplateRef<any> | null): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        const modifiedState: CarouselState = {
            ...state,
            template,
        };

        return new ContinueWith(modifiedState);
    };
}
