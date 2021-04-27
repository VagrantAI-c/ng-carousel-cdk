import { IdGenerator } from '../id-generator';
import { ProcedureEnvironment } from '../procedure/procedure-environment.interface';

export const MOCK_PROCEDURE_ENVIRONMENT: ProcedureEnvironment = {
  afterAnimationAction: () => {},
  autoplayAction: () => {},
  animationBezierArgs: [1, 1, 1, 1],
  animationBuilder: null,
  isBrowser: true,
  maxOverscroll: 1,
  slideIdGenerator: new IdGenerator(),
  swipeThreshold: 1,
};
