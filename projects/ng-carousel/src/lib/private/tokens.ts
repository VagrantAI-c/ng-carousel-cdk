import { InjectionToken } from '@angular/core';

import { IdGenerator } from './models/id-generator';

export const SLIDE_ID_GENERATOR = new InjectionToken<IdGenerator>('slideIdGenerator');
export const ANIMATION_ID_GENERATOR = new InjectionToken<IdGenerator>('slideIdGenerator');
