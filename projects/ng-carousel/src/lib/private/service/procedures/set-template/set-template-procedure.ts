import { TemplateRef } from '@angular/core';

import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Assigns TemplateRef in which slides would be rendered
 */
export function setTemplateProcedure(template: TemplateRef<any> | null): Procedure {
    return ({state}: ProcedureStateFacade): ProcedureHandler => {
        state.template = template;

        return new ContinueWith(state);
    }
}
