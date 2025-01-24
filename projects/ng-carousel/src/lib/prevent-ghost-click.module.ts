import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventGhostClickDirective } from './prevent-ghost-click.directive';

@NgModule({
    imports: [
      CommonModule,
      PreventGhostClickDirective,
    ],
    exports: [
      PreventGhostClickDirective,
    ],
})
export class CarouselPreventGhostClickModule {}
